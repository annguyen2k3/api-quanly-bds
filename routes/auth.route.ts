import { Request, Response, Router } from "express";
import * as controller from "../controllers/auth.controller";
const router: Router = Router()


router.post("/login", controller.login )

router.patch("/password-reset", controller.resetPassword )

router.post("/logout", controller.logout)

export const authRouter: Router = router