import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { apiRoutes } from "../apiRoutes.js";
import {
  createComment,
  deleteComment,
  getAllComments,
  toggleLikeComment,
} from "../controllers/comment.controller.js";

const router = Router();

// ✅ Create a comment
router.route(apiRoutes.COMMENTS.CREATE).post(verifyJWT, createComment);

// ✅ Get all Comments
router.route(apiRoutes.COMMENTS.GET_ALL).get(getAllComments);

// ✅ Delete a comment (only author)
router.route(apiRoutes.COMMENTS.DELETE).delete(verifyJWT, deleteComment);

// ✅ Toggle like/unlike a comment
router.route(apiRoutes.COMMENTS.LIKE).post(verifyJWT, toggleLikeComment);

export default router;
