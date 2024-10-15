import express, { Router, Request, Response } from 'express';
import { handleError, handleNotFound, handleSuccess } from '../helpers/responseHelper';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  handleSuccess(res, 'Welcome to the API', {
    version: '1.0.0',
  });
})

router.use((req: Request, res: Response) => {
  handleNotFound(res, 'Route Not Found');
});

router.use((error: unknown, req: Request, res: Response) => {
  handleError(res, 'Internal Server Error', error);
});

export default router;