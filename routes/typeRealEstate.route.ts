import { Router } from "express";
const router: Router = Router()

import * as authMiddleware from "../middleware/auth.middleware"
import * as controller from "../controllers/typeRealEstate.controller"

router.get(
    "/list", 
    authMiddleware.requireAuth,
    controller.getList)


export const realEstateRouter: Router = router