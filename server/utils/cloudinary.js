import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const filter = (req, file, cb) => {
	if (
		file.mimetype == "image/png" ||
		file.mimetype == "image/jpeg" ||
		file.mimetype == "image/jpg"
		) {
			cb(null, true)
		} else {
			cb(null, false)
		}
	}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: storage, fileFilter: filter });

const uploadToCloudinary = async (localPath) => {
	try {
		let response = await cloudinary.uploader.upload(localPath);
		fs.unlinkSync(localPath);
		return response.url;
	} catch (e) {
		console.log("Error from cloudinary");
		console.log(e);
		fs.unlinkSync(localPath);
	}
}

export {
	upload,
	uploadToCloudinary
}
