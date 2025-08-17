import Comment from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    if (!content || !content.trim()) {
      throw new ApiError(400, "Comment content is required");
    }

    const post = await Post.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    // Create comment
    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content: content.trim(),
    });
    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();
    //Return response
    return res
      .status(201)
      .json(new ApiResponse(201, comment, "Comment Created Successfully"));
  } catch (error) {
    throw new ApiError(400, error.message ?? "Comment creation failed");
  }
});

const getAllComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!postId) throw new ApiError(400, "Post ID is required");
  try {
    const comments = await Comment.find({ post: postId })
      .populate("author", "username avatar fullName")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message ?? "Failed to fetch Comments");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) throw new ApiError(400, "Comment ID is required");
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");
    if (comment.author.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to delete this comment");
    }

    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });
    // Delete comment
    await Comment.findByIdAndDelete(comment._id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment Deleted successfully"));
  } catch (error) {
    throw new ApiError(400, error.message ?? "Failed to Delete Comment");
  }
});

const toggleLikeComment = asyncHandler(async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) throw new ApiError(404, "Comment not found");
    let message = "";
    if (comment.likes.includes(req.user._id)) {
      // Unlike comment
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
      message = "Comment unliked successfully";
    } else {
      // Like comment
      comment.likes.push(req.user._id);
      message = "Comment liked successfully";
    }
    await comment.save();

    return res.status(200).json(new ApiResponse(200, {}, message));
  } catch (error) {
    throw new ApiError(400, error.message ?? "Failed to Like Comment");
  }
});

export { createComment, getAllComments, deleteComment, toggleLikeComment };
