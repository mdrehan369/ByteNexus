import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    content: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const commentModel = new mongoose.model("Comment", commentSchema);

