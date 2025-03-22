import { Router } from "express";
const router: Router = Router()

import * as controller from "../controllers/staff.controller"
import * as authMiddleware from "../middleware/auth.middleware"


router.get(
    "/detail/:nvid", 
    authMiddleware.protectRoute,
    authMiddleware.isAdmin,
    controller.detail)

router.patch(
    "/password-reset", 
    authMiddleware.protectRoute, 
    authMiddleware.isAdmin, 
    controller.resetPassword 
)

export const staffRouter: Router = router