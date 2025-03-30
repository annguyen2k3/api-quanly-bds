import { Router } from "express";
const router: Router = Router()

import * as authMiddleware from "../middleware/auth.middleware"
import * as controller from "../controllers/customer.controller"
import {validateData} from "../validates/validate"
import * as customerSchema from "../validates/customerSchema.validate";

router.get(
    "/list", 
    authMiddleware.requireAuth,
    controller.getList)

router.get(
    "/detail/:khid",
    authMiddleware.requireAuth,
    controller.detail
)

router.post(
    "/create",
    authMiddleware.requireAuth,
    validateData(customerSchema.customerSchemaBase),
    controller.create
)

router.put(
    "/update/:khid",
    authMiddleware.requireAuth,
    validateData(customerSchema.customerSchemaBase),
    controller.update
)

export const customerRouter: Router = router