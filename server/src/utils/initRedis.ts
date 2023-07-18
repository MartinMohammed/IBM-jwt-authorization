import {
  createClient,
  RedisClientOptions,
  RedisModules,
  RedisFunctions,
  RedisScripts,
} from "redis";
import logger from "../logger";

/** The RedisClientWrapper class acts as a wrapper for the Redis client, implementing the singleton pattern. */
class RedisClientWrapper {
  // Represents the Redis client object that will be created using the redis.createClient() method.
  private static instance: RedisClientWrapper;

  // The client property will be accessed on the singleton object.
  readonly client: ReturnType<typeof createClient>;

  /**
   * Private constructor that can only be called from within the class itself.
   * It creates the Redis client object using the redis.createClient() method.
   */
  private constructor() {
    const { REDIS_HOST, REDIS_PORT } = process.env;
    const options = {
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    };
    this.client = createClient(options);

    /** Some events to listen to  */
    this.client.on("connect", () => {
      logger.info("Client connected to redis.");
    });
    this.client.on("ready", () => {
      logger.info("Client connected to redis and db is ready to use.");
    });

    this.client.on("end", () => {
      logger.info("Client disconnected from edis.");
    });

    this.client.on("error", (err: Error) => {
      logger.error(err.message);
    });

    process.on("SIGINT", () => {
      this.client.quit();
    });
  }

  /**
   * Returns the single instance of the RedisClientWrapper class,
   * implementing the singleton pattern.
   * If an instance already exists, it returns the existing instance; otherwise, it creates a new instance.
   */
  static getInstance(): RedisClientWrapper {
    // Check if there is already a singleton object
    if (!RedisClientWrapper.instance) {
      // Call the private constructor and save the instance of RedisClientWrapper
      RedisClientWrapper.instance = new RedisClientWrapper();
    }

    // Return the instance of RedisClientWrapper with the client property
    return RedisClientWrapper.instance;
  }
}

export default RedisClientWrapper;
