# NarrotoPost Backend

**NarrotoPost** is a modern blog API built with **Node.js, Express, and MongoDB**.  
It allows users to register, login, create and manage posts, add comments, and like posts or comments. Images are uploaded via **Cloudinary**.  

---

## Features

- User Authentication (JWT)
- CRUD operations for Posts
- CRUD operations for Comments
- Like/Unlike functionality for posts and comments
- Tags and Categories for posts
- Cloudinary image upload support
- Analytics endpoints (Top Authors, Most Liked Posts, Dashboard stats)

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT
- **File Storage:** Cloudinary

---

## Installation

1. Clone the repository:
Install dependencies:
npm install

2. Create a .env file with the following variables:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

3.Start Server
npm run dev

git clone https://github.com/<USERNAME>/narratopost-backend-nodejs.git
cd narratopost-backend-nodejs
