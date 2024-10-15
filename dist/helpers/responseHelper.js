"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.handleToManyRequest = exports.handleNotFound = exports.handleForbidden = exports.handleUnauthorized = exports.handleBadRequest = exports.handleUpdated = exports.handleCreated = exports.handleSuccess = void 0;
const handleSuccess = (res, message, data) => {
    return res.status(200).json({
        status: 'Success',
        message,
        data,
    });
};
exports.handleSuccess = handleSuccess;
const handleCreated = (res, message) => {
    return res.status(201).json({
        status: 'Created',
        message,
    });
};
exports.handleCreated = handleCreated;
const handleUpdated = (res, message) => {
    return res.status(201).json({
        status: 'Updated',
        message,
    });
};
exports.handleUpdated = handleUpdated;
const handleBadRequest = (res, message) => {
    return res.status(400).json({
        status: 'Bad Request',
        message,
    });
};
exports.handleBadRequest = handleBadRequest;
const handleUnauthorized = (res, message) => {
    return res.status(401).json({
        status: 'Unauthorized',
        message,
    });
};
exports.handleUnauthorized = handleUnauthorized;
const handleForbidden = (res, message) => {
    return res.status(403).json({
        status: 'Forbidden',
        message,
    });
};
exports.handleForbidden = handleForbidden;
const handleNotFound = (res, message) => {
    return res.status(404).json({
        status: 'Not Found',
        message,
    });
};
exports.handleNotFound = handleNotFound;
const handleToManyRequest = (res, message) => {
    return res.status(429).json({
        status: 'To Many Requests',
        message,
    });
};
exports.handleToManyRequest = handleToManyRequest;
const handleError = (res, message, error) => {
    return res.status(500).json({
        status: 'Error',
        message,
        error,
    });
};
exports.handleError = handleError;
