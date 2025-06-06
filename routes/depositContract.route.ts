import { Router } from "express";
const router: Router = Router()

import * as authMiddleware from "../middleware/auth.middleware"
import * as controller from "../controllers/depositContract.controller"
import {validateData} from "../validates/validate"
import { csmContractSchema, depositContractSchema } from "../validates/contractSchema.validate";

router.get(
    "/list", 
    authMiddleware.requireAuth,
    controller.getList
)

router.get(
    "/:dcid", 
    authMiddleware.requireAuth,
    controller.detail
)

router.post(
    "/", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(depositContractSchema),
    controller.create
)

router.put(
    "/cancel/:dcid", 
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    controller.cancel
)

router.delete(
    "/:dcid",
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    controller.deleted
)

export const depositContractRouter: Router = router