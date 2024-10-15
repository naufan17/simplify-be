import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { handleToManyRequest } from '../helpers/responseHelper';

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,     // 10 minutes
  max: 100,                     // limit each IP to 100 requests per windowMs
  handler: (req: Request, res: Response) => {
    handleToManyRequest(res, 'Too many requests from this IP, please try again after 10 minutes')
  }
})

export default limiter;