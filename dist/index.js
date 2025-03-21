"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
const bodyParser = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const index_route_1 = __importDefault(require("./routes/index.route"));
dotenv_1.default.config();
database_1.default;
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3030;
app.use(bodyParser.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
(0, index_route_1.default)(app);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
