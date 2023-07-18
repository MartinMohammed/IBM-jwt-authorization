import app from "./app";
import logger from "./logger";
import initMongoDb from "./utils/initMongoDb";
import { createClient } from "redis";
import RedisClientWrapper from "./utils/initRedis";

const PORT: number = +process.env.PORT || 3000;

(async () => {
  // Setup connection to mongo db
  await initMongoDb();
  // Setup connection to redis db
  await RedisClientWrapper.getInstance().client.connect();

  app.listen(PORT, () => {
    logger.info(`Server is now listening at PORT: ${PORT}.`);
  });
})();
