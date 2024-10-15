"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const limiter_1 = __importDefault(require("./config/limiter"));
const logger_1 = __importDefault(require("./config/logger"));
const api_1 = __importDefault(require("./routes/api"));
require("./config/database");
const app = (0, express_1.default)();
const hostname = process.env.HOSTNAME || 'localhost';
const port = Number(process.env.PORT) || 8000;
const stream = {
    write: (message) => logger_1.default.info(message.trim())
};
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(limiter_1.default);
app.use((0, morgan_1.default)('combined', { stream }));
app.use('/api/v1.0', api_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});
exports.default = app;
