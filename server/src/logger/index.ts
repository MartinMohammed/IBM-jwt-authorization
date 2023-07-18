import winston from "winston";

/**
 * Creates a test logger instance that logs only to the console.
 * @returns The created logger instance.
 */
const logger = (function testLogger() {
  /*
    Destructure the format methods from winston.format
    - combine: Combine multiple format methods
    - timestamp: Add timestamp to log entries
    - prettyPrint: Format log entries in a readable way
    - colorize: Colorize log output in the console
  */
  const { combine, timestamp, prettyPrint, colorize } = winston.format;
  const customLoggerOutputFormat = winston.format.printf(
    ({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    }
  );

  // Create a logger instance for the development environment
  const logger = winston.createLogger({
    level: "debug", // Log all levels from "debug" and higher (towards error)
    format: combine(
      timestamp({ format: "HH:mm:ss" }), // Add timestamp in "HH:mm:ss" format
      colorize(), // Colorize log output in the console
      prettyPrint(), // Format log entries in a human-readable way
      customLoggerOutputFormat // Apply custom log format
    ),
    transports: [new winston.transports.Console()],
  });

  return logger;
})();

export default logger;
