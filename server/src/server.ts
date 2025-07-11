import express from "express";

import corsConfig from "./config/corsConfig.ts";
import databaseConfig from "./config/databaseConfig.ts";
import environmentConfig from "./config/envConfig.ts";
import { Service } from "./data/enums.ts";
import Logger from "./utils/logger.ts";

//Initialize dependencies
Logger.init();
environmentConfig.init();

const logger = Logger.get(Service.Server);
logger.info("Server initialization started");
async function bootstrapServer(): Promise<void> {
  try {
    const app = express();

    const env = environmentConfig.get();
    logger.debug("Environment variables loaded", {
      port: env.port,
      client: env.client,
    });
    logger.silly("Environment configuration parsed successfully");

    //setup middleware
    logger.verbose("Configuring middleware");
    app.use(corsConfig.get(env.client));
    app.use(express.json());
    logger.debug("Middleware applied: CORS, JSON parser");

    //health check route
    app.get("/health", (req, res) => {
      logger.http("Health check request received", { path: req.path });
      res.status(200).json({ status: "OK" });
    });

    //connect to database
    logger.info("Initiating database connection");
    await databaseConfig.connect(env.dbServer, env.dbName);
    logger.info("Database connected successfully");

    //start server
    logger.verbose(`Starting server on port ${String(env.port)}`);
    app
      .listen(env.port, () => {
        logger.info(`Server listening on port ${String(env.port)}`);
      })
      .on("error", (err) => {
        logger.error("Server startup failed", { error: err.message, name: err.name });
        process.exit(1);
      });
  } catch (error) {
    logger.error("Server initialization failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

//start the server
bootstrapServer().catch((error: unknown) => {
  logger.error("Unexpected error during server startup", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
