import { Router } from "express";
const router: Router = Router()

import * as controller from "../controllers/staff.controller"
import * as authMiddleware from "../middleware/auth.middleware"
import {validateData} from "../validates/validate"
import { staffSchema } from "../validates/staffSchema";


router.get(
    "/detail/:nvid", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    controller.detail)

router.post(
    "/create", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(staffSchema),
    controller.create)

router.patch(
    "/update/:id", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(staffSchema),
    controller.update)

router.patch(
    "/password-reset", 
    authMiddleware.requireAuth, 
    authMiddleware.isAdmin, 
    controller.resetPassword 
)

export const staffRouter: Router = router