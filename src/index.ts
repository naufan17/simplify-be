import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import limiter from './config/limiter';
import logger from './config/logger';
import api from './routes/api';
import './config/database';

const app: Express = express();
const hostname: string = process.env.HOSTNAME || 'localhost';
const port: number = Number(process.env.PORT) || 8000;
const stream = { 
  write: (message: string) => logger.info(message.trim()) 
};

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(morgan('combined', { stream }));

app.use('/api/v1.0', api);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});

export default app; 