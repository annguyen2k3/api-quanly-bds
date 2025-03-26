import { Router } from "express";
const router: Router = Router()

import * as controller from "../controllers/staff.controller"
import * as authMiddleware from "../middleware/auth.middleware"
import {validateData} from "../validates/validate"
import * as staffSchema from "../validates/staffSchema.validate";


router.get(
    "/list", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    controller.getList)

router.get(
    "/detail/:nvid", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    controller.detail)

router.post(
    "/create", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(staffSchema.create),
    controller.create)

router.put(
    "/update/:id", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(staffSchema.updateAdmin),
    controller.update)

router.patch(
    "/password-reset", 
    authMiddleware.requireAuth, 
    authMiddleware.isAdmin, 
    controller.resetPassword 
)

export const staffRouter: Router = router