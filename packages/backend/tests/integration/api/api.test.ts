import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createTestDbPath, initTestDb, cleanupTestDbs } from "../helpers/db";

let app: any;

beforeAll(async () => {
  const dbPath = createTestDbPath();
  initTestDb(dbPath);
  process.env.DATABASE_URL = dbPath;
  const mod = await import("../../../src/presentation/server");
  app = mod.createServer();
});

afterAll(() => {
  delete process.env.DATABASE_URL;
  cleanupTestDbs();
});

describe("API Integration", () => {
  let token: string;
  let categoryId: string;
  let expenseId: string;

  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("POST /api/auth/register creates a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email: "test@example.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
    token = res.body.token;
  });

  it("POST /api/auth/register rejects duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Another", email: "test@example.com", password: "123456" });

    expect(res.status).toBe(409);
  });

  it("POST /api/auth/login returns token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("POST /api/auth/login rejects wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("PUT /api/auth/me updates the profile name", async () => {
    const res = await request(app)
      .put("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated User" });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Updated User");
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("PUT /api/auth/me requires authentication", async () => {
    const res = await request(app).put("/api/auth/me").send({ name: "No Token" });
    expect(res.status).toBe(401);
  });

  it("PUT /api/auth/password changes the password", async () => {
    const res = await request(app)
      .put("/api/auth/password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "123456", newPassword: "654321", confirmPassword: "654321" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("PUT /api/auth/password rejects wrong current password", async () => {
    const res = await request(app)
      .put("/api/auth/password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "wrong", newPassword: "654321", confirmPassword: "654321" });

    expect(res.status).toBe(401);
  });

  it("PUT /api/auth/password rejects mismatched confirmation", async () => {
    const res = await request(app)
      .put("/api/auth/password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "654321", newPassword: "654321", confirmPassword: "other" });

    expect(res.status).toBe(400);
  });

  it("logs in with the new password after change", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "654321" });

    expect(res.status).toBe(200);
  });

  it("POST /api/categories creates a category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Food", icon: "🍕", color: "#FF5733" });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Food");
    categoryId = res.body.id;
  });

  it("GET /api/categories lists categories", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("PUT /api/categories/:id updates a category", async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Drinks", icon: "🥤", color: "#33FF57" });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Drinks");
  });

  it("POST /api/expenses creates an expense", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 50,
        description: "Lunch",
        date: "2024-06-15",
        categoryId,
      });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(50);
    expenseId = res.body.id;
  });

  it("GET /api/expenses lists expenses", async () => {
    const res = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/expenses/:id returns an expense", async () => {
    const res = await request(app)
      .get(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(expenseId);
  });

  it("PUT /api/expenses/:id updates an expense", async () => {
    const res = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Dinner", amount: 75 });

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(75);
  });

  it("GET /api/dashboard/monthly returns summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/monthly?year=2024&month=6")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalExpenses).toBeDefined();
  });

  it("DELETE /api/expenses/:id deletes an expense", async () => {
    const res = await request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("DELETE /api/categories/:id deletes a category", async () => {
    const res = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(401);
  });
});
