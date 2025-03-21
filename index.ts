import express, { Express, Request, Response } from "express";
import sequelize from "./config/database";
import dotenv from "dotenv";
import bodyParser = require("body-parser");
import cookieParser from "cookie-parser";
import cors from "cors"

import routers from "./routes/index.route";

dotenv.config()

sequelize;

const app: Express = express()
const port: number = parseInt(process.env.PORT ) || 3000

app.use(bodyParser.json())

// CORS
app.use(cors())

// Sử dụng cookie-parser
app.use(cookieParser());

// Routers
routers(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})