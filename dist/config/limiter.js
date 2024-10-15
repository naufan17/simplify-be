"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const responseHelper_1 = require("../helpers/responseHelper");
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    handler: (req, res) => {
        (0, responseHelper_1.handleToManyRequest)(res, 'Too many requests from this IP, please try again after 10 minutes');
    }
});
exports.default = limiter;
