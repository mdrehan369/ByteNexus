import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    links: [
        {
            type: String,
            default: "",
            trim: true
        }
    ],
    profilePic: {
        type: String, // cloudinary url
        default: ""
    },
    coverPic: {
        type: String, // cloudinary url
        default: ""
    },
    about: {
        type: String,
        default: ""
    },
    headline: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
    history: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
    skills: [
        {
            type: String,
            trim: true
        }
    ]
})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            username: this.username,
            email: this.email,
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const userModel = mongoose.model("User", userSchema);
