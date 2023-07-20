import supertest from "supertest";
import app from "../../app";

describe("Expect that the swaggerUI is running: ", () => {
  it("should return status code 200 when requesting to page: ", async () => {
    const { statusCode, body } = await supertest(app).get("/api-docs");
    expect(statusCode).toBe(301);
  });
});
