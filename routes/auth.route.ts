import { Request, Response, Router } from "express";
import * as controller from "../controllers/auth.controller";
import * as authMiddleware from "../middleware/auth.middleware"

const router: Router = Router()

router.post("/login", controller.login )

router.get("/profile", authMiddleware.protectRoute, controller.profile )

router.get("/logout", controller.logout)

export const authRouter: Router = router