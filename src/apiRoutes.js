// constants/apiRoutes.js
export const apiRoutes = {
  USER: {
    REGISTER: "/register", // Register a new user
    LOGIN: "/login", // Login with credentials
    CHANGE_PASSWORD: "/change-password", // Change current password
    UPDATE_AVATAR: "/update-avatar", // Update profile avatar
    UPDATE_COVER_IMAGE: "/update-cover-image", // Update profile cover image
    CURRENT_USER: "/current-user", // Get current logged-in user details
    UPDATE_DETAILS: "/user-details", // Update user details (email, name, etc.)
    REFRESH_TOKEN: "/refresh-token", // Refresh access token
    LOGOUT: "/logout", // Logout user and clear session
  },

  POST: {
    CREATE: "/create", // Create a new post
    GET_ALL: "/all", // Get all posts
    GET_ONE: "/:id", // Get a single post by ID
    UPDATE: "/:id", // Update post by ID
    DELETE: "/:id", // Delete post by ID
    LIKE: "/:id/toggle-like", // Like or unlike a post
  },

  COMMENTS: {
    GET_ALL: "/:postId", // Get all comments for a specific post
    CREATE: "/:postId", // Add a comment to a post
    DELETE: "/:commentId", // Delete a comment by ID (only author/admin)
    LIKE: "/:commentId/like", // Like or unlike a comment
  },

  ANALYTICS: {
    TOP_AUTHORS: "/top-authors", // Get list of top authors (based on posts/likes)
    MOST_LIKED_POSTS: "/most-liked-posts", // Get most liked posts
    DASHBOARD: "/stats", // Get current user’s dashboard stats
  },
};
