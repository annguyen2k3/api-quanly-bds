import express, { Express, Request, Response, NextFunction } from "express";
import sequelize from "./config/database";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors"

import routers from "./routes/index.route";
import { runContractCron } from "./crons/contract.cron";

dotenv.config()
sequelize;

const app: Express = express()
const port: number = parseInt(process.env.PORT) || 3030

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình CORS
const allowedOrigins = ['http://localhost:5173', 'https://rs-fe.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    // Cho phép requests không có origin (như từ Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true
}));

// Thêm headers CORS cụ thể
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Xử lý preflight requests
app.options('*', cors());

// Kết thúc cấu hình CORS

// Sử dụng cookie-parser
app.use(cookieParser());

// Cron
runContractCron()

// Routers
routers(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})