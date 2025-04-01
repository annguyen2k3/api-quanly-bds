import { Router } from "express";
const router: Router = Router()

import * as controller from "../controllers/realEstate.controller"
import * as authMiddleware from "../middleware/auth.middleware"
import {validateData} from "../validates/validate"


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
    controller.create
)

router.put(
    "/:id",
    authMiddleware.requireAuth,
    controller.update
)


export const realEstateRoute: Router = router