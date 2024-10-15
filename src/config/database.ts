import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DB_URL;

if (!databaseUrl) throw new Error("Database URL is not defined in .env file");

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl:process.env.ENV === "production" ? { rejectUnauthorized: false } : false,
  },
  pool: {
    max: 10,            // Maximum number of connections in the pool
    min: 2,             // Minimum number of connections in the pool
    acquire: 30000,     // Max time (in ms) to wait for a connection to be established before throwing error
    idle: 10000,        // Max time (in ms) that a connection can be idle before being released
    evict: 15000,       // Time (in ms) a connection can stay idle before being evicted
    maxUses: 5000,      // Max uses for each connection before replacing it with a new one (to prevent issues with long-living connections)
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("⚡️[server]: Database connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();