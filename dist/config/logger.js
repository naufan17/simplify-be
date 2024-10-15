"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const getDate_1 = require("../utils/getDate");
const { combine, timestamp, json, simple, colorize } = winston_1.format;
const dateFormat = (0, getDate_1.getDate)();
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(timestamp(), json()),
    transports: [
        new winston_1.transports.File({
            filename: `./logs/error-${dateFormat}.log`,
            level: "error"
        }),
        new winston_1.transports.File({
            filename: `./logs/combined-${dateFormat}.log`
        })
    ]
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.transports.Console({
        format: combine(colorize(), simple())
    }));
}
exports.default = logger;
