import { Express , Request, Response, Router} from "express"
import { authRouter } from "./auth.route"
import { staffRouter } from "./staff.route"
import { meRouter } from "./me.route"

const routers = (app: Express): void => {
    
    app.get("/", (req: Request, res: Response) => {
        res.send("server-api-quan-ly-bds")
    })

    app.use("/auth", authRouter)

    app.use("/me", meRouter)

    app.use("/staff", staffRouter)

}

export default routers