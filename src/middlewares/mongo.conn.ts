import { MongoClient } from "../../deps.ts";
import logger from "./logger.prods.ts";

const MONGO_URI =
  "mongodb+srv://ferru:ferru2647@cluster0.lpvnv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient();

try {
  await client.connect(MONGO_URI);
  logger.debug(`Base de datos conectada ${MONGO_URI}`);
} catch (error) {
  logger.error(error);
}

const dbConn = client.database("prods");

export default dbConn;
