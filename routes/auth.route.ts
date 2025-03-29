import { Request, Response, Router } from "express";
import * as controller from "../controllers/auth.controller";
import { validateData } from "../validates/validate";
import * as staffValidate from "../validates/staffSchema.validate"

const router: Router = Router()

router.post(
    "/login", 
    validateData(staffValidate.login),
    controller.login 
)

router.post("/logout", controller.logout)

export const authRouter: Router = router