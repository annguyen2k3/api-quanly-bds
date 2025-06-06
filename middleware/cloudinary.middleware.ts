import express, {Request, Response, NextFunction } from "express"
import {v2 as cloudinary} from "cloudinary"
import streamifier from "streamifier"

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});
// End Cloudinary

const streamUpload = (buffer: any) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

const uploadToCloudinary = async (buffer: any) => {
    let result = await streamUpload(buffer);
    return result['secure_url'];
};

export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await uploadToCloudinary(req["file"].buffer);
        req.body[req["file"].fieldname] = result;
    } catch (error) {
        console.log(error);
    }

    next();
};

export const uploadFields = async (req: Request, res: Response, next: NextFunction) => {
    for (const key in req["files"]) {
        req.body[key] = [];

        const array = req["files"][key];
        for (const item of array) {
            try {
                const result = await uploadToCloudinary(item.buffer);
                req.body[key].push(result);
            } catch (error) {
                console.log(error);
            }
        }
    }
    next();
};
