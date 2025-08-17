import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { apiRoutes } from "../apiRoutes.js";
import { POST_FIELDS } from "../constants.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ✅ Create a new post
router.route(apiRoutes.POST.CREATE).post(
  verifyJWT,
  upload.fields([
    {
      name: POST_FIELDS.POST_IMAGE,
      maxCount: 1,
    },
  ]),
  createPost
);

// ✅ Get all posts
router.route(apiRoutes.POST.GET_ALL).get(getAllPosts);

// ✅ Get a single post by ID
router.route(apiRoutes.POST.GET_ONE).get(getPostById);

// ✅ Update a post (only author)
router
  .route(apiRoutes.POST.UPDATE)
  .put(
    verifyJWT,
    upload.fields([{ name: POST_FIELDS.POST_IMAGE, maxCount: 1 }]),
    updatePost
  );

// ✅ Delete a post (only author)
router.route(apiRoutes.POST.DELETE).delete(verifyJWT, deletePost);

// ✅ Toggle like/unlike a post
router.route(apiRoutes.POST.LIKE).post(verifyJWT, toggleLikePost);

export default router;
