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
    "/:nvid", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    controller.detail)

router.post(
    "/", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(staffSchema.staffSchemaBase),
    controller.create)

router.put(
    "/:id", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(staffSchema.updateAdmin),
    controller.update)


export const staffRouter: Router = router