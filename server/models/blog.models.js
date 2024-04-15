import mongoose, { Schema } from "mongoose"

const blogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    topics: [
        {
            type: String,
            required: true
        }
    ],
    frontImage: {
        type: String,
        default: "" // cloudinary url
    }
}, {timestamps: true});

export const blogModel = mongoose.model("Blog", blogSchema);
