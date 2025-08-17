import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {
  //GET DETAILS
  const { title, content, caption, tags, category } = req.body;
  //Validate TITLE CONTENT AND CAPTION
  if (!title || !content || !caption) {
    throw new ApiError(400, "Title, Content or Caption is Required");
  }
  const tagsArray = tags
    ? tags.split(",").map((tag) => tag.trim().toLowerCase())
    : [];

  const categoryNames = category
    ? category.split(",").map((cat) => cat.trim().toLowerCase())
    : [];

  //Check for post image
  const postImageLocalPath = Array.isArray(req.files?.postImage)
    ? req.files.postImage[0]?.path
    : undefined;
  if (!postImageLocalPath) {
    throw new ApiError(400, "Post Image is Required!");
  }
  //   Upload to Cloudinary to get the Post Image URL
  const postImage = await uploadOnCloudinary(postImageLocalPath);
  if (!postImage) {
    throw new ApiError(400, "Post Image Uploads Failed!");
  }

  //Create post object - create entry in db
  const post = await Post.create({
    author: req.user._id,
    title,
    content,
    caption,
    tags: tagsArray,
    category: categoryNames,
    postImage: postImage.url,
  });
  //Return response
  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post Created Successfully"));
});
const getAllPosts = asyncHandler(async (req, res) => {
  // Fetch all posts from DB
  const posts = await Post.find().populate(
    "author",
    "username fullName avatar"
  );
  if (!posts) throw new ApiError(404, "Posts not found!");

  // Return response
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate(
    "author",
    "-password -refreshToken"
  );

  if (!post) throw new ApiError(404, "Post not found!");

  // Return response
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Posts fetched successfully"));
});
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, caption, tags, category } = req.body;

  // Find the post first
  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found!");

  // Optional: handle post image upload
  let postImage;
  const postImageLocalPath = Array.isArray(req.files?.postImage)
    ? req.files.postImage[0]?.path
    : undefined;
  if (postImageLocalPath) {
    const uploadResult = await uploadOnCloudinary(postImageLocalPath);
    postImage = uploadResult?.url;
  }

  // Update fields
  if (title) post.title = title;
  if (content) post.content = content;
  if (caption) post.caption = caption;
  if (tags) post.tags = Array.isArray(tags) ? tags : [tags];
  if (category) post.category = Array.isArray(category) ? category : [category];
  if (postImage) post.postImage = postImage;

  // Save updated post
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found!");
  await post.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});
const toggleLikePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found!");

  //Toggle Like
  const userId = req.user._id.toString();
  let message = "";
  if (post.likes.includes(userId)) {
    //Unlike
    post.likes = post.likes.filter((like) => like.toString() !== userId);
    message = "Post Unliked Successfully";
  } else {
    //Like
    post.likes.push(userId);
    message = "Post Liked Successfully";
  }
  await post.save();
  return res.status(200).json(new ApiResponse(200, {}, message));
});
export {
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost,
  toggleLikePost,
};
