import mongoose, { Schema } from 'mongoose';

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
});

export const likeModel = mongoose.model('Like', LikeSchema);
