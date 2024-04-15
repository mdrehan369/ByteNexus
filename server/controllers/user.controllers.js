import { ApiError } from "../utils/ApiError.js"
import { userModel } from "../models/user.models.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { OAuth2Client } from "google-auth-library";


const verifyGoogleToken = async (req, res) => {

    try {
        const client = new OAuth2Client(process.env.CLIENT_ID);
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });
        const payload = ticket.getPayload();
        console.log(payload);
        res
            .status(200)
            .json(new ApiResponse(
                200,
                payload,
                "Token verified"
            ))
    } catch (e) {
        console.log(e);
    }
}

const cookieOptions = {
    httpOnly: true,
    secure: true
}

const signupController = async (req, res) => {

    try {
        const { username, name, password, email } = req.body;

        if (!username || !email) {
            res.status(400).send(new ApiError(400, "Username or email is required"));
            return;
        }

        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (user) {
            res.status(401).send(new ApiError(401, "User already registered"));
            return;
        }

        const newUser = await userModel.create({ username, name, password, email });
        const savedUser = await newUser.save();

        if (!savedUser) {
            res.status(500).send(new ApiError(500, "Some error occured while creating the document"));
            return;
        }

        const token = savedUser.generateAccessToken();

        savedUser['password'] = undefined;

        res
            .status(200)
            .cookie("accessToken", token, cookieOptions)
            .send(new ApiResponse(
                200,
                savedUser,
                "User created successfully"
            ))
    } catch (e) {
        console.log(e);
    }
}

const addOtherCredentialsController = async (req, res) => {
    try {
        let { links, about, headline, location } = req.body;
        const files = req.files;
        links = links.split(",").map(link => link.trim());
        // console.log(links);

        const profilePicLocalPath = files?.profilePic?.[0].path;
        const coverPicLocalPath = files?.coverPic?.[0].path;

        let profilePicUrl = "";
        let coverPicUrl = "";

        let user = null;

        let updates = {
            links,
            about,
            headline,
            location,
        }

        if (profilePicLocalPath) {
            profilePicUrl = await uploadToCloudinary(profilePicLocalPath);
            updates['profilePic'] = profilePicUrl;
        }
        if (coverPicLocalPath) {
            coverPicUrl = await uploadToCloudinary(coverPicLocalPath);
            updates['coverPic'] = coverPicUrl;
        }

        user = await userModel.findByIdAndUpdate(req.user._id, updates, { new: true });

        res
            .status(200)
            .json(new ApiResponse(200, user, "User updated succesfully"));

    } catch (e) {
        console.log(e);
    }
}

const getCurrentUserController = async (req, res) => {
    const user = req.user;
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User sent"
            )
        )
    return;
}

const loginController = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        const user = await userModel.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        })

        if (!user) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "User does not exist"
                ))
            return;
        }

        const isPasswordValid = await user.verifyPassword(password);

        if (isPasswordValid) {
            const token = user.generateAccessToken();

            res
                .status(200)
                .cookie("accessToken", token, cookieOptions)
                .json(new ApiResponse(
                    200,
                    user,
                    "User logged in successfully"
                ))

        } else {
            res
                .status(401)
                .json(new ApiError(
                    401,
                    {},
                    "Invalid credentials"
                ))
        }


    } catch (e) {
        console.log(e);
    }
}

const getUserByUsernameController = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userModel.findOne({ username }).select("-password");
        if (!user) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "No user found"
                ))
        } else {
            res
                .status(200)
                .json(new ApiResponse(
                    200,
                    user,
                    "User found",
                ))
        }
    } catch (e) {
        console.log(e);
    }
}

const logoutController = async (req, res) => {
    res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .json(new ApiResponse(
            200,
            {},
            "User logged off successfully"
        ));
}

const updateUserDetails = async (req, res) => {
    try {
        const { name, about, headline, location, links } = req.body;
        await userModel.findByIdAndUpdate(req.user._id, {
            name,
            about,
            headline,
            location,
            links
        });
        res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "User updated successfully"
            ))
    } catch (e) {
        console.log(e);
    }
}

const updateProfilePic = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            await userModel.findByIdAndUpdate(req.user._id, { profilePic: "" });
            res
                .status(200)
                .json(new ApiError(
                    200,
                    "Deleted Profile Pic"
                ))
            return;
        }

        const cloudinaryUrl = await uploadToCloudinary(req.file.path);
        await userModel.findByIdAndUpdate(req.user._id, { profilePic: cloudinaryUrl });

        res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "Profile Pic Updated successfully"
            ))

    } catch (e) {
        console.log(e);
    }
}

const updateCoverPic = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            await userModel.findByIdAndUpdate(req.user._id, { coverPic: "" });
            res
                .status(200)
                .json(new ApiError(
                    200,
                    "Path required"
                ))
            return;
        }

        const cloudinaryUrl = await uploadToCloudinary(req.file.path);
        await userModel.findByIdAndUpdate(req.user._id, { coverPic: cloudinaryUrl });

        res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "Cover Pic Updated successfully"
            ))

    } catch (e) {
        console.log(e);
    }
}

const searchUsers = async (req, res) => {
    try {
        const { query } = req.params;
        if (!query) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "No query"
                ))
            return;
        }
        const users = await userModel.find({
            username: {
                $regex: `^${query}`, $options: "i"
            }
        })

        res
            .status(200)
            .json(new ApiResponse(
                200,
                users,
                "Users fetched successfully"
            ))

    } catch (e) {
        console.log(e);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).limit(100);
        res
            .status(200)
            .json(new ApiResponse(
                200,
                users,
                "All users fetched successfully"
            ))
    } catch (e) {
        console.log(e);
    }
}

const followerController = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        const myUser = await userModel.findById(req.user._id);

        if (!user) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "No user found"
                ));
            return;
        }

        let followed;
        if (user.followers.includes(req.user._id)) {
            user.followers.splice(user.followers.indexOf(req.user._id), 1);
            myUser.following.splice(myUser.following.indexOf(user._id), 1);
            followed = false;
        } else {
            user.followers.push(req.user._id);
            myUser.following.push(user._id)
            followed = true;
        }

        await user.save({ validateBeforeSave: false });
        await myUser.save({ validateBeforeSave: false });

        res
            .status(200)
            .json(new ApiResponse(
                200,
                {
                    followed
                },
                "Toggled follower"
            ));

    } catch (e) {
        console.log(e);
    }
}

const getuserByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);

        if (!user) {
            res
                .status(400)
                .json(new ApiError(
                    400,
                    "No user found"
                ));
            return;
        }

        res
            .status(200)
            .json(new ApiResponse(
                200,
                user,
                "User fetched successfully"
            ))
    } catch (e) {
        console.log(e);
    }
}

export {
    signupController,
    addOtherCredentialsController,
    getCurrentUserController,
    loginController,
    getUserByUsernameController,
    logoutController,
    updateUserDetails,
    updateProfilePic,
    updateCoverPic,
    searchUsers,
    getAllUsers,
    followerController,
    getuserByUserIdController,
    verifyGoogleToken
}