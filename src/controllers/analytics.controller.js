import Comment from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Get Top Authors based on number of posts and likes
export const getTopAuthors = asyncHandler(async (req, res) => {
  const authors = await Post.aggregate([
    {
      $group: {
        _id: "$author",
        totalPosts: { $sum: 1 },
        totalLikes: { $sum: { $size: "$likes" } },
      },
    },
    { $sort: { totalLikes: -1, totalPosts: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $project: {
        _id: 0,
        authorId: "$author._id",
        username: "$author.username",
        fullName: "$author.fullName",
        totalPosts: 1,
        totalLikes: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, authors, "Top Authors fetched successfully"));
});

// ✅ Get Most Liked Posts
export const getMostLikedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.aggregate([
    {
      $addFields: {
        likesCount: { $size: { $ifNull: ["$likes", []] } },
      },
    },
    { $sort: { likesCount: -1, createdAt: -1 } },
    { $limit: 10 },
  ]);

  if (!posts || posts.every((post) => post.likesCount === 0)) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No liked posts yet"));
  }

  const postsWithAuthor = await Post.populate(posts, {
    path: "author",
    select: "username fullName",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, postsWithAuthor, "Most Liked Posts fetched successfully"));
});


// ✅ Get Current User Dashboard Stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const posts = await Post.find({ author: userId });
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);

  const totalComments = await Comment.countDocuments({ author: userId });

  const dashboard = {
    totalPosts,
    totalLikes,
    totalComments,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashboard, "Dashboard stats fetched successfully"));
});
