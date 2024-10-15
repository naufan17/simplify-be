"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const responseHelper_1 = require("../helpers/responseHelper");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    (0, responseHelper_1.handleSuccess)(res, 'Welcome to the API', {
        version: '1.0.0',
    });
});
router.use((req, res) => {
    (0, responseHelper_1.handleNotFound)(res, 'Route Not Found');
});
router.use((error, req, res) => {
    (0, responseHelper_1.handleError)(res, 'Internal Server Error', error);
});
exports.default = router;
