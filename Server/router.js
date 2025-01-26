import { Router } from "express";
import { listItem, searchItems, returnItem, rentItem } from "./controller.js";

const router = Router();

router.get("/search", async (req, res) => {
  const { name, minPrice, maxPrice } = req.query;
  const items = await searchItems(name, minPrice, maxPrice);
  res.json(items);
});

router.post("/item", async (req, res) => {
  const message = await listItem(req.body);
  res.json(message);
});

router.put("/rental/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, startDate, endDate } = req.query;
  const message = await rentItem(userId, id, startDate, endDate);
  res.json(message);
});

router.put("/return/rental/:id", async (req, res) => {
  const { id } = req.params;

  const message = await returnItem(id);
  res.json(message);
});

export default router;
