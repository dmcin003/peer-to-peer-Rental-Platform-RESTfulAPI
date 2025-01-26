import { v5, v4 } from "uuid";
import moment from "moment";

const NAMESPACE = v4();

export const generateId = (item) => {
  // Generate a UUID based on item attributes
  return v5(`${item.name}-${item.description}-${item.pricePerDay}`, NAMESPACE);
};

export const filterItems = (name, minPrice, maxPrice, items) => {
  //Filter by name and priceRange
  if (name && minPrice && maxPrice) {
    return items.filter(
      (item) =>
        item.name === name &&
        item.pricePerDay >= minPrice &&
        item.pricePerDay <= maxPrice &&
        item.available === true
    );
  }
  //Filter by name only
  else if (name) {
    return items.filter(
      (item) => item.name === name && item.available === true
    );
  }
  //Filter by priceRange only
  else if (minPrice && maxPrice) {
    return items.filter(
      (item) =>
        item.pricePerDay >= minPrice &&
        item.pricePerDay <= maxPrice &&
        item.available === true
    );
  } else {
    //Filter by available items only
    return items.filter((item) => item.available === true);
  }
};

export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return false;
  }

  // Convert input to moment objects
  const current = moment();
  const start = moment(startDate, "YYYY-MM-DD", true);
  const end = moment(endDate, "YYYY-MM-DD", true);

  // Check if the dates are valid
  if (!start.isValid() || !end.isValid()) {
    return false;
  }

  // Check if the date range is valid
  if (end.isBefore(start) || start.isBefore(current, "day")) {
    return false;
  }

  return true;
};

export const isDateRangeOverlap = (
  startDate1,
  endDate1,
  startDate2,
  endDate2
) => {
  // Parse the dates using moment
  const range1Start = moment(startDate1, "YYYY-MM-DD");
  const range1End = moment(endDate1, "YYYY-MM-DD");
  const range2Start = moment(startDate2, "YYYY-MM-DD");
  const range2End = moment(endDate2, "YYYY-MM-DD");

  // Validate dates
  if (
    !range1Start.isValid() ||
    !range1End.isValid() ||
    !range2Start.isValid() ||
    !range2End.isValid()
  ) {
    throw new Error("Invalid date provided");
  }

  // Check for overlap
  return (
    range1Start.isSameOrBefore(range2End) &&
    range2Start.isSameOrBefore(range1End)
  );
};
