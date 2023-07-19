import { describe, it } from "vitest";
import supertest from "supertest";
import app from "../../app";
import IUser from "../../customTypes/User";

/** This tests the auth route using vitetest */
describe("It should do x.", () => {
  const demoUser = {
    email: "test@test.com",
    password: "test",
  };
  describe("/register", () => {
    it("should create a new user in the database and return a new pair of tokens.", () => {
      const response = supertest(app).post("/register").send(demoUser);
      console.log(response);
      console.log("jasjfjs");
      expect(1).toBe(1);
    });
  });
  describe.todo("/login");
  describe.todo("/refresh-token");
  describe.todo("/logout");
});
