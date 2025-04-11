import { Router } from "express";
const router: Router = Router()
import multer from "multer"

import * as controller from "../controllers/realEstate.controller"
import * as authMiddleware from "../middleware/auth.middleware"
import {validateData} from "../validates/validate"
import { realEstateSchemaBase } from "../validates/realEstateSchema.validate";
import * as uploadCloud from "../middleware/cloudinary.middleware"

const upload = multer({
    storage: multer.memoryStorage(),
});

router.get(
    "/list", 
    authMiddleware.requireAuth,
    controller.getList)

router.get(
    "/:id", 
    authMiddleware.requireAuth,
    controller.detail)

router.post(
    "/",
    authMiddleware.requireAuth,
    upload.fields([{ name: "hinhanh", maxCount: 5 }]),
    validateData(realEstateSchemaBase),
    uploadCloud.uploadFields,
    controller.create
)

router.put(
    "/:id",
    authMiddleware.requireAuth,
    upload.fields([{ name: "hinhanh", maxCount: 5 }]),
    validateData(realEstateSchemaBase),
    uploadCloud.uploadFields,
    controller.update
)

router.delete(
    "/:id",
    authMiddleware.requireAuth,
    controller.deleted
)


export const realEstateRoute: Router = router