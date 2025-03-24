import { Router } from "express";
const router: Router = Router()

import * as controller from "../controllers/staff.controller"
import * as authMiddleware from "../middleware/auth.middleware"
import {validateData} from "../validates/staff.validate"
import { staffSchema } from "../validates/staffSchema";


router.get(
    "/detail/:nvid", 
    authMiddleware.protectRoute,
    authMiddleware.isAdmin,
    controller.detail)

router.post(
    "/create", 
    authMiddleware.protectRoute,
    authMiddleware.isAdmin,
    validateData(staffSchema),
    controller.create)

router.patch(
    "/password-reset", 
    authMiddleware.protectRoute, 
    authMiddleware.isAdmin, 
    controller.resetPassword 
)

export const staffRouter: Router = router