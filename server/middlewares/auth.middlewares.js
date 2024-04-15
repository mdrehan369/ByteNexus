import jwt from "jsonwebtoken";
import { userModel } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header['Authorization']?.replace("Bearer ", "");
        if(!token) {
            res
            .status(200)
            .json(new ApiError(
                401,
                "Please log in first"
            ))
            return;
        }
        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await userModel.findById(decodedInfo?._id);

        if(!user) {
            res.status(500).json(new ApiError(500, "Problem while fetching user"));
            return;
        }

        req.user = user;
        next();

    } catch(e) {
        console.log(e);
    }
}

export { verifyJwt }