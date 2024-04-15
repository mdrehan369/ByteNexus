import express from "express";
import { upload } from "../utils/cloudinary.js";
import {
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
} from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js"

const router = express.Router();

router.route("/register").post(signupController);
router.route("/login").post(loginController);
router.route("/verifyWithGoogle").post(verifyGoogleToken);
router.route("/user/:username").get(getUserByUsernameController);
router.route("/userById/:userId").get(getuserByUserIdController);

// Protected Routes
router.route("/addOtherCredentials").post(
    verifyJwt,
    upload.fields([
        {name: "profilePic", maxCount: 1},
        {name: "coverPic", maxCount: 1}
    ]),
    addOtherCredentialsController
    );

router.route("/getCurrentUser").get(verifyJwt, getCurrentUserController);
router.route("/logout").get(verifyJwt, logoutController);
router.route("/updateUserDetails").post(verifyJwt, updateUserDetails);
router.route("/updateProfilePic").post(verifyJwt, upload.single("profilePic"), updateProfilePic);
router.route("/updateCoverPic").post(verifyJwt, upload.single("coverPic"), updateCoverPic);
router.route("/searchUsers/:query").get(verifyJwt, searchUsers);
router.route("/getAllUsers").get(verifyJwt, getAllUsers);
router.route("/follow/:userId").get(verifyJwt, followerController);

export default router;
