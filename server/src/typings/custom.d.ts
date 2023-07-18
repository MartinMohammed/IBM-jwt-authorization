/**
 * Declare a namespace to extend the existing NodeJS namespace.
 */
declare namespace NodeJS {
  /**
   * Extend the ProcessEnv interface to define custom environment variables and their types.
   */
  interface ProcessEnv {
    /**
     * The port number the application will listen on.
     */
    PORT: string;

    /**
     * Represents the mongo connection URI
     */
    MONGO_URI: string;

    /**
     * Represents the particular db we want to connect to.
     */
    DB_NAME: string;

    /**
     * Represents the initially created database
     * */
    MONGO_INITDB_DATABASE: string;

    /**
     * Represents the secret that is used to create the
     * digital signature of the jwt payload and headers of the Access Token.
     */
    JWT_SIGNING_KEY: string;

    /**
     * Represents the secret that is used to create the
     * digital signature of the the jwt payload and headers of the Refresh Token.
     */
    REFRESH_TOKEN_KEY: string;

    /**
     * Hostname to the redis db
     */
    REDIS_HOST: string;

    /**
     * Port of the redis db
     */
    REDIS_PORT: string;
  }
}
