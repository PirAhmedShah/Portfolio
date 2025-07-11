import dotenv from "dotenv";
import winston from "winston";

import { Service } from "../data/enums.ts";

export interface EnvConfig {
  port: number;
  client: string;
  dbServer: string;
  dbName: string;
  dbAuthUser: string;
  dbAuthPass: string;
}

function init(): void {
  const logger = winston.loggers.get(Service.Server);
  logger.verbose("Loading environment variables with dotenv");
  dotenv.config();
  logger.silly("Environment variables loaded.");
}

function get(): EnvConfig {
  const logger = winston.loggers.get(Service.Server);
  logger.verbose("Parsing environment variables with dotenv");

  const port = Number(process.env.PORT);
  const client = process.env.CLIENT;
  const dbServer = process.env.DB_SERVER;
  const dbName = process.env.DB_NAME;
  const dbAuthUser = process.env.DB_AUTH_USER;
  const dbAuthPass = process.env.DB_AUTH_PASS;

  //validations
  if (isNaN(port) || port <= 0) {
    logger.error("Invalid or missing PORT environment variable", { port: process.env.PORT });
    throw new Error("PORT must be a valid positive number");
  }

  if (!client || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(client)) {
    logger.warn("Invalid or missing CLIENT URL", { client });
    throw new Error("CLIENT must be a valid URL");
  }

  if (!dbServer || !dbName) {
    logger.error("Missing database configuration", { dbServer, dbName });
    throw new Error("DB_SERVER and DB_NAME are required");
  }

  if (!dbAuthUser || !dbAuthPass) {
    logger.error("Missing MongoDB credentials", { dbAuthUser, dbAuthPass });
    throw new Error("DB_AUTH_USER and DB_AUTH_PASS are required");
  }

  logger.debug("Environment variables validated successfully");
  return { port, client, dbServer, dbName, dbAuthUser, dbAuthPass };
}

export default {
  init,
  get,
};