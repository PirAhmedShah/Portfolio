import mongoose from "mongoose";
import winston from "winston";

import { Service } from "../data/enums.ts";

async function connect(dbServer: string, dbName: string): Promise<void> {
  const logger = winston.loggers.get(Service.Server);
  const connectionString = `${dbServer}/${dbName}`;

  logger.debug("Preparing MongoDB connection", { connectionString: dbServer });

  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      auth: {
        username: process.env.DB_AUTH_USER as string,
        password: process.env.DB_AUTH_PASS as string,
      },
      authSource: dbName,
    });
    logger.silly("MongoDB connection established successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB connection disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB connection reestablished");
  });
}

export default {
  connect,
};
