"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    dialectModule: require('mysql2'),
    dialectOptions: {
        typeCast: function (field, next) {
            if (field.type === 'BIT' && field.length === 1) {
                const bytes = field.buffer();
                return bytes[0];
            }
            return next();
        }
    }
});
sequelize
    .authenticate()
    .then(() => {
    console.log("Connect Success!");
})
    .catch((error) => {
    console.error("Connect Error: " + error);
});
exports.default = sequelize;
