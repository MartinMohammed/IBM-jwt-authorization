import mongoose from "mongoose";
import logger from "../logger";

/**
 * Initializes the MongoDB database connection using Mongoose.
 */
async function initMongoDb() {
  try {
    // Connect to MongoDB using the provided connection URI and options
    let mongoUri: string;
    if (process.env.NODE_ENV === "test") {
      mongoUri = `mongodb://mongodb:27017/testDb`;
    } else if (process.env.NODE_ENV === "production") {
      mongoUri = `mongodb+srv://${process.env.MONGO_ATLAS_DB_USERNAME}:${process.env.MONGO_ATLAS_DB_PASSWORD}@cluster0.pqvdc.mongodb.net/${process.env.MONGO_ATLAS_DB_NAME}?retryWrites=true&w=majority`;
    } else {
      mongoUri = `mongodb://mongodb:27017/gymDo`;
    }
    await mongoose.connect(mongoUri);
  } catch (error) {
    logger.error(`Failed to establish MongoDB connection: ${error}.`);
  }
}

// Log a message when the Mongoose connection is established
mongoose.connection.on("connected", () => {
  logger.info("Mongoose connected to the database.");
});

// Handle any errors that occur during the database connection
mongoose.connection.on("error", (error) => {
  logger.error(`Mongoose failed to connect to the database: ${error.message}.`);
});

// Log a message when the Mongoose connection is disconnected
mongoose.connection.on("disconnected", () => {
  logger.info("Mongoose is disconnected from the database.");
});

// ctrl + Z
process.on("SIGINT", async () => {
  logger.info("CTRL + Z was pressed - initialize teardown of the application.");
  await mongoose.connection.close();
  logger.verbose(
    `Disconnected from mongo db after terminating application was successful.`
  );

  //   Shutdown
  process.exit(0);
});

export default initMongoDb;
