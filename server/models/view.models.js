import mongoose, { Schema } from "mongoose";

const viewsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    }
});

export const viewsModel = new mongoose.model('View', viewsSchema);
