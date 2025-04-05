import { Express , Request, Response, Router} from "express"
import { authRouter } from "./auth.route"
import { staffRouter } from "./staff.route"
import { meRouter } from "./me.route"
import { customerRouter } from "./customer.route"
import { typeRealEstateRouter } from "./typeRealEstate.route"
import { realEstateRoute } from "./realEstate.route"
import {  consignmentContractRouter } from "./consignmentContract.route"
import { depositContractRouter } from "./depositContract.route"

const routers = (app: Express): void => {
    
    app.get("/", (req: Request, res: Response) => {
        res.send("server-api-quan-ly-bds")
    })

    app.use("/auth", authRouter)

    app.use("/me", meRouter)

    app.use("/staff", staffRouter)

    app.use("/customer", customerRouter)

    app.use("/type-real-estate", typeRealEstateRouter)

    app.use("/real-estate", realEstateRoute)

    app.use("/consignment-contract", consignmentContractRouter)

    app.use("/deposit-contract", depositContractRouter)
}

export default routers