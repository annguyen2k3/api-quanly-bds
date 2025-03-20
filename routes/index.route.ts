import { Express , Request, Response} from "express"
import { authRouter } from "./auth.route"

const routers = (app: Express): void => {
    
    app.get("/", (req: Request, res: Response) => {
        res.send("server-api-quan-ly-bds")
    })

    app.use("/auth", authRouter)

}

export default routers