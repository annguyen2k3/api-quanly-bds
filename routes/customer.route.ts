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
    "/:khid",
    authMiddleware.requireAuth,
    controller.detail
)

router.post(
    "/",
    authMiddleware.requireAuth,
    validateData(customerSchema.customerSchemaBase),
    controller.create
)

router.put(
    "/:khid",
    authMiddleware.requireAuth,
    validateData(customerSchema.customerSchemaBase),
    controller.update
)

router.get(
    "/request/list",
    authMiddleware.requireAuth,
    controller.listRequest
)

router.post(
    "/request",
    authMiddleware.requireAuth,
    validateData(customerSchema.requestCustomerSchema),
    controller.createRequest
)

export const customerRouter: Router = router