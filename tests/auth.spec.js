const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prisma.client");

let token;
let registeredUser;

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.organisation.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /auth/register", () => {
    it("should return validation errors if required fields are missing", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({})
        .expect(422);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(4);
    });

    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password",
          phone: "+1234567890"
        })
        .expect(201);

      registeredUser = response.body.data.user;

      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data.user).toHaveProperty("userId");
      expect(response.body.data.user).toHaveProperty("firstName", "John");
      expect(response.body.data.user).toHaveProperty("lastName", "Doe");
      expect(response.body.data.user).toHaveProperty(
        "email",
        "john.doe@example.com"
      );
      expect(response.body.data.user).toHaveProperty("phone", "+1234567890");
    });

    it("should return an error if user with the same email already exists", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password",
          phone: "+1234567890"
        })
        .expect(422);

      expect(response.body.message).toBe("User with this email already exists");
    });
  });

  describe("POST /auth/login", () => {
    it("should return 401 error if login fails", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "john.doe@example.com",
          password: "wrong password"
        })
        .expect(401);

      expect(response.body.message).toBe("Authentication failed");
    });

    it("should login a user", async () => {
      console.log(registeredUser);

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "john.doe@example.com",
          password: "password"
        })
        .expect(200);

      const responseBody = response.body;
      token = responseBody.data.accessToken;

      expect(responseBody.data).toHaveProperty("accessToken");
      expect(responseBody.data).toHaveProperty("user");
      expect(responseBody.data.user).toHaveProperty("userId");
      expect(responseBody.data.user).toHaveProperty(
        "firstName",
        registeredUser.firstName
      );
      expect(responseBody.data.user).toHaveProperty(
        "lastName",
        registeredUser.lastName
      );
      expect(responseBody.data.user).toHaveProperty(
        "email",
        registeredUser.email
      );
      expect(responseBody.data.user).toHaveProperty(
        "phone",
        registeredUser.phone
      );
    });
  });

  describe("GET /api/organisations", () => {
    it("should verify the default organisation is created", async () => {
      const response = await request(app)
        .get("/api/organisations")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const responseBody = response.body;

      expect(responseBody.data).toHaveProperty("organisations");
      expect(responseBody.data.organisations).toHaveLength(1);
      expect(responseBody.data.organisations[0]).toHaveProperty("orgId");
      expect(responseBody.data.organisations[0]).toHaveProperty("name");
      expect(responseBody.data.organisations[0]).toHaveProperty("description");
      expect(responseBody.data.organisations[0].name.split("'")[0]).toEqual(
        registeredUser.firstName
      );
      expect(responseBody.data.organisations[0].name).toEqual(
        `${registeredUser.firstName}'s Organisation`
      );
    });
  });
});
