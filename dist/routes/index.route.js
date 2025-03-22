"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = require("./auth.route");
const staff_route_1 = require("./staff.route");
const routers = (app) => {
    app.get("/", (req, res) => {
        res.send("server-api-quan-ly-bds");
    });
    app.use("/auth", auth_route_1.authRouter);
    app.use("/staff", staff_route_1.staffRouter);
};
exports.default = routers;
