import { Router } from "express";
import {
  getTopAuthors,
  getMostLikedPosts,
  getDashboardStats,
} from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { apiRoutes } from "../apiRoutes.js";

const router = Router();

// ✅ Get top authors based on posts/likes
router.route(apiRoutes.ANALYTICS.TOP_AUTHORS).get(getTopAuthors);

// ✅ Get most liked posts
router.route(apiRoutes.ANALYTICS.MOST_LIKED_POSTS).get(getMostLikedPosts);

// ✅ Get current user dashboard stats (requires login)
router.route(apiRoutes.ANALYTICS.DASHBOARD).get(verifyJWT, getDashboardStats);

export default router;
