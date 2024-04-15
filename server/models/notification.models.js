import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

NotificationSchema.methods.markRead = async function () {
  this.read = true;
  await this.save();
};

export const notificationModel = mongoose.model("Notification", NotificationSchema)