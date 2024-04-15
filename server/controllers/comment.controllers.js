import { blogModel } from "../models/blog.models.js";
import { commentModel, likeModel } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addCommentController = async (req, res) => {
    try {
        const { blogId, content } = req.body;
        const blog = await blogModel.findById(blogId);
        if (!blog) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "Invalid blog ID"
                ));
            return;
        }
        const newComment = await commentModel.create({
            content,
            blog: blogId,
            user: req.user._id,
            replies: []
        });

        const comment = await newComment.save();

        res
            .status(200)
            .json(new ApiResponse(
                200,
                comment,
                "Comment added"
            ))
    } catch (e) {
        console.log(e);
    }
}

const deleteCommentController = async (req, res) => {

    try {
        const { commentId } = req.params;
        const comment = await commentModel.findById(commentId);

        if (!comment) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "No comment found"
                ));
            return;
        }

        if (comment.user != req.user._id) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "Not authorized to delete this"
                ));
            return;
        }

        const blog = await blogModel.findById(comment.blogId);
        blog.comments.splice(blog.comments.indexOf(commentId), 1);
        await blog.save();

        await comment.deleteOne();

        res
            .status(200)
            .json(new ApiResponse(
                200,
                "Comment deleted successfully"
            ))
    } catch (e) {
        console.log(e);
    }
}

const likeCommentController = async (req, res) => {
    try {
        const { commentId } = req.query;
        const comment = await commentModel.findById(commentId);

        if (!comment) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "No comment found"
                ));
            return;
        }

        const isLiked = await likeModel.findOne({comment: commentId, user: req.user._id});

        if(!isLiked) {
            const newLikedCmt = await likeModel.create({
                comment: commentId,
                user: req.user._id
            });
            await newLikedCmt.save();
        } else {
            await isLiked.deleteOne();
        }

        res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "Toggled successfully"
            ))
    } catch (e) {
        console.log(e);
    }
}

const getCommentsController = async (req, res) => {
    try {

        const { blogId } = req.query;

        if (!blogId) {
            return res
                .status(400)
                .json(new ApiError(
                    400,
                    "No Blog Id"
                ))
        }

        const comments = await commentModel.aggregate([
            {
                '$match': {
                    'blog': new mongoose.Types.ObjectId(`${blogId}`)
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'user',
                    'foreignField': '_id',
                    'as': 'commentUser',
                    'pipeline': [
                        {
                            '$project': {
                                'username': 1,
                                'name': 1,
                                'profilePic': 1
                            }
                        }
                    ]
                }
            }, {
                '$addFields': {
                    'commentUser': {
                        '$first': '$commentUser'
                    }
                }
            },
            {

                '$lookup': {
                    'from': 'likes',
                    'localField': '_id',
                    'foreignField': 'comment',
                    'as': 'likedBy'
                }

            },
            {
                '$sort': {
                    'createdAt': -1
                }
            }
        ])

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                comments,
                "Comments Fetched Successfully"
            ))

    } catch (e) {
        console.log(e);
    }
}

export {
    addCommentController,
    deleteCommentController,
    likeCommentController,
    getCommentsController
}