import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: "postgres",
});


(async () => {
  try {
    await sequelize.authenticate();
    console.log("⚡️[database]: Database connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();