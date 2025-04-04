import { Router } from "express";
const router: Router = Router()

import * as authMiddleware from "../middleware/auth.middleware"
import * as controller from "../controllers/consignmentContract.controller"
import {validateData} from "../validates/validate"
import { csmContractSchema } from "../validates/contractSchema.validate";

router.get(
    "/list", 
    authMiddleware.requireAuth,
    controller.getList
)

router.get(
    "/:kgid", 
    authMiddleware.requireAuth,
    controller.detail
)

router.post(
    "/",
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(csmContractSchema),
    controller.create
)

router.put(
    "/:kgid",
    authMiddleware.requireAuth,
    authMiddleware.isAdmin,
    validateData(csmContractSchema),
    controller.update
)


export const consignmentContract: Router = router