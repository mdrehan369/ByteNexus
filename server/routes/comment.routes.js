import express from "express";
import {
    addCommentController,
    deleteCommentController,
    getCommentsController,
    likeCommentController
} from "../controllers/comment.controllers.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js"

const router = express.Router()

// Protected routes

router.route("/addComment").post(verifyJwt, addCommentController);
router.route("/deleteComment/:commentId").get(verifyJwt, deleteCommentController);
router.route("/likeComment").get(verifyJwt, likeCommentController);
router.route("/getComments").get(verifyJwt, getCommentsController);

export default router
