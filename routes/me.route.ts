import { Router } from "express";
const router: Router = Router()

import * as controller from "../controllers/me.controller"
import * as authMiddleware from "../middleware/auth.middleware"
import { validateData } from "../validates/validate";
import * as staffSchema from "../validates/staffSchema.validate";


router.get(
    "/", 
    authMiddleware.requireAuth,
    controller.profile
)

router.put(
    "/", 
    authMiddleware.requireAuth,
    validateData(staffSchema.updateMe),
    controller.updateProfile
)

router.put(
    "/change-pass", 
    authMiddleware.requireAuth,
    validateData(staffSchema.changePassword),
    controller.changePass
)

export const meRouter: Router = router