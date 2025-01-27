import { v4 } from "uuid";
import moment from 'moment';
import {
  generateId,
  filterItems,
  isValidDateRange,
  isDateRangeOverlap,
} from "./utils";

describe("Utils Tests", () => {
  const testNamespace = v4();

  describe("generateId", () => {
    it("should generate a consistent UUID for the same input", () => {
      const item = { name: "Item1", description: "Test item", pricePerDay: 10 };
      const id1 = generateId(item);
      const id2 = generateId(item);
      expect(id1).toBe(id2);
    });

    it("should generate different UUIDs for different inputs", () => {
      const item1 = { name: "Item1", description: "Test item", pricePerDay: 10 };
      const item2 = { name: "Item2", description: "Another item", pricePerDay: 20 };
      const id1 = generateId(item1);
      const id2 = generateId(item2);
      expect(id1).not.toBe(id2);
    });
  });

  describe("filterItems", () => {
    const items = [
      { name: "Item1", pricePerDay: 10, available: true },
      { name: "Item2", pricePerDay: 20, available: false },
      { name: "Item3", pricePerDay: 30, available: true },
    ];

    it("should filter items by name", () => {
      const result = filterItems("Item1", null, null, items);
      expect(result).toEqual([{ name: "Item1", pricePerDay: 10, available: true }]);
    });

    it("should filter items by price range", () => {
      const result = filterItems(null, 5, 12, items);
      expect(result).toEqual([{ name: "Item1", pricePerDay: 10, available: true }]);
    });

    it("should filter items by name and price range", () => {
      const result = filterItems("Item3", 15, 35, items);
      expect(result).toEqual([{ name: "Item3", pricePerDay: 30, available: true }]);
    });

    it("should filter available items when no criteria are provided", () => {
      const result = filterItems(null, null, null, items);
      expect(result).toEqual([
        { name: "Item1", pricePerDay: 10, available: true },
        { name: "Item3", pricePerDay: 30, available: true },
      ]);
    });
  });

  describe("isValidDateRange", () => {
    it("should return false for invalid dates", () => {
      expect(isValidDateRange("2023-01-01", "invalid-date")).toBe(false);
      expect(isValidDateRange(null, "2023-01-01")).toBe(false);
    });

    it("should return false for end date before start date", () => {
      expect(isValidDateRange("2023-01-05", "2023-01-01")).toBe(false);
    });

    it("should return true for valid date ranges", () => {
      const today = moment().format("YYYY-MM-DD");
      const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
      expect(isValidDateRange(today, tomorrow)).toBe(true);
    });
  });

  describe("isDateRangeOverlap", () => {
    it("should throw an error for invalid dates", () => {
      expect(() =>
        isDateRangeOverlap("invalid-date", "2023-01-05", "2023-01-01", "2023-01-10")
      ).toThrow("Invalid date provided");
    });

    it("should return true for overlapping date ranges", () => {
      expect(
        isDateRangeOverlap("2023-01-01", "2023-01-10", "2023-01-05", "2023-01-15")
      ).toBe(true);
    });

    it("should return false for non-overlapping date ranges", () => {
      expect(
        isDateRangeOverlap("2023-01-01", "2023-01-05", "2023-01-06", "2023-01-10")
      ).toBe(false);
    });
  });
});