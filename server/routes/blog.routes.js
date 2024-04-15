import express from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
    getAllBlogsController,
    addBlogController,
    getBlogsByUserNameController,
    searchBlogsController,
    deleteBlogController,
    likeBlogController,
    getBlogByBlogIdController,
    isLiked,
    markViewed,
    getUsersWhoLiked,
    getOnlyFollowingBlogsController,
    searchByTopicsController,
    getBlogsController,
    toggleBookmarkBlog,
    getBookmarksController,
    getHistoryController
} from "../controllers/blog.controllers.js"
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/getAllBlogs").get(getAllBlogsController);
router.route("/getBlogsOfFollowers").get(getOnlyFollowingBlogsController);
router.route("/getBlogsByUsername/:username").get(getBlogsByUserNameController);
router.route("/searchBlogs").get(searchBlogsController);
router.route("/searchBlogsByTopics").get(searchByTopicsController);

// protected Routes

router.route("/addBlog").post(verifyJwt, upload.single("frontImage"), addBlogController);
router.route("/deleteBlog/:blogId").get(verifyJwt, deleteBlogController);
router.route("/likeBlog/:blogId").get(verifyJwt, likeBlogController);
router.route("/getBlog/:blogId").get(verifyJwt, getBlogByBlogIdController);
router.route("/isLiked").get(verifyJwt, isLiked);
router.route('/markView').get(verifyJwt, markViewed);
router.route('/getUsersWhoLiked').get(verifyJwt, getUsersWhoLiked);
router.route('/getBlogs').get(verifyJwt, getBlogsController);
router.route('/bookmark').get(verifyJwt, toggleBookmarkBlog);
router.route('/getBookmarks').get(verifyJwt, getBookmarksController);
router.route('/getHistory').get(verifyJwt, getHistoryController);

export default router