import supertest from "supertest";
import app from "../../app";

/**
 * Test suite for the '/health' endpoint.
 */
describe("Given the endpoint '/health':", () => {
  /**
   * Test case: should respond with '200' HTTP status code and an empty JSON object when making a GET request.
   */
  it("should respond with '200' HTTP status code and an empty JSON object when making a GET request", async () => {
    // Send a GET request to the '/health' endpoint using supertest
    const response = await supertest(app).get("/health");

    // Expect the response status code to be 200
    expect(response.statusCode).toBe(200);

    // Expect the response body to be an empty JSON object
    expect(response.body).toEqual({
      message: "OK",
    });
  });
});
