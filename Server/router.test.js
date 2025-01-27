import request from "supertest";
import express from "express";
import router from "./router.js"; // Import your router

// Mock the controller functions
jest.mock("./controller.js", () => ({
  listItem: jest.fn().mockResolvedValue({ message: "Item listed successfully" }),
  searchItems: jest.fn().mockResolvedValue([
    { id: 1, name: "Item1", pricePerDay: 10, available: true },
  ]),
  returnItem: jest.fn().mockResolvedValue({ message: "Item returned successfully" }),
  rentItem: jest.fn().mockResolvedValue({ message: "Item rented successfully" }),
}));

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use(router);

describe("Router Tests", () => {
  it("should return a successful ping", async () => {
    const response = await request(app).get("/ping");
    expect(response.status).toBe(200);
    expect(response.body).toBe("ping successful");
  });

  it("should search for items", async () => {
    const response = await request(app)
      .get("/search")
      .query({ name: "Item1", minPrice: 5, maxPrice: 20 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Item1", pricePerDay: 10, available: true },
    ]);
  });

  it("should list a new item", async () => {
    const newItem = { name: "Item1", description: "A test item", pricePerDay: 15 };

    const response = await request(app)
      .post("/item")
      .send(newItem);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Item listed successfully" });
  });

  it("should rent an item", async () => {
    const response = await request(app)
      .put("/rental/1")
      .query({ userId: "user123", startDate: "2023-01-01", endDate: "2023-01-10" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Item rented successfully" });
  });

  it("should return a rental item", async () => {
    const response = await request(app).put("/return/rental/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Item returned successfully" });
  });
});