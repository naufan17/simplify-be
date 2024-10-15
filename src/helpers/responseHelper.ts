import { Response } from "express";

export const handleSuccess = <T>(res: Response, message: string, data: T) => {
  return res.status(200).json({
    status: 'Success',
    message,
    data,
  });
};

export const handleCreated = (res: Response, message: string) => {
  return res.status(201).json({
    status: 'Created',
    message,
  });
};

export const handleUpdated = (res: Response, message: string) => {
  return res.status(201).json({
    status: 'Updated',
    message,
  });
};

export const handleBadRequest = (res: Response, message: string) => {
  return res.status(400).json({
    status: 'Bad Request',
    message,
  });
};

export const handleUnauthorized = (res: Response, message: string) => {
  return res.status(401).json({
    status: 'Unauthorized',
    message,
  });
};

export const handleForbidden = (res: Response, message: string) => {
  return res.status(403).json({
    status: 'Forbidden',
    message,
  });
};

export const handleNotFound = (res: Response, message: string) => {
  return res.status(404).json({
    status: 'Not Found',
    message,
  });
};

export const handleToManyRequest = (res: Response, message: string) => {
  return res.status(429).json({
    status: 'To Many Requests',
    message,
  });
};

export const handleError = (res: Response, message: string, error: unknown) => {
  return res.status(500).json({
    status: 'Error',
    message,
    error,
  });
};