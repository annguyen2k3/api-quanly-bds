import { Router } from "express";
const router: Router = Router()

import * as authMiddleware from "../middleware/auth.middleware"
import * as controller from "../controllers/transferContract.controller"
import {validateData} from "../validates/validate"
import { csmContractSchema, depositContractSchema, transferContractSchema } from "../validates/contractSchema.validate";

router.get(
    "/list", 
    authMiddleware.requireAuth,
    controller.getList
)

router.get(
    "/:cnid",
    authMiddleware.requireAuth,
    controller.detail
)

router.post(
    "/",
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(transferContractSchema),
    controller.create
)

router.delete(
    "/:cnid",
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    controller.deleteContract
)

export const transferContractRouter: Router = router