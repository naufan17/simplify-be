import express, { Express } from 'express';
import './config/database';

const app: Express = express();
const port: number = Number(process.env.PORT) || 8000;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app; 