import {
  readItems,
  createItem,
  updateItem,
  getItemById,
  readRentals,
  removeRental,
  addRental,
} from "./db/db.js";
import {
  filterItems,
  generateId,
  isDateRangeOverlap,
  isValidDateRange,
} from "./utils.js";

export const listItem = async (item) => {
  const id = generateId(item);
  item.id = id;
  item.available = true;
  try {
    await createItem(item);
  } catch (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: `You listed: ${item.name} on the platform: item id: ${item.id}`,
  };
};

export const searchItems = async (name, minPrice, maxPrice) => {
  try {
    const allItems = await readItems();
    const availableItemsFiltered = filterItems(
      name,
      minPrice,
      maxPrice,
      allItems
    );

    return availableItemsFiltered;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const rentItem = async (userId, itemId, startDate, endDate) => {
  if(!userId){
    return {success:false,message:"Please enter a userId"}
  }
  try {
    const item = await getItemById(itemId);
    if (item) {
      //change availability to false because item is now rented
      item.available = false;
      const isValid = isValidDateRange(startDate, endDate);
      if (isValid) {
        item.startDate = startDate;
        item.endDate = endDate;
      } else {
        return { success: false, message: "Date Range is not valid" };
      }

      const rentals = await readRentals();
      if (rentals.length) {
        const userRentals = rentals.filter(
          (rental) => rental.userId === userId
        );

        const overlappingRental = userRentals.filter((rental) => {
          return isDateRangeOverlap(
            rental.startDate,
            rental.endDate,
            startDate,
            endDate
          );
        });

        if (overlappingRental.length) {
          return {
            success: false,
            message: "You already have a rental in this date range",
          };
        }
      }

      await addRental({ userId, itemId, startDate, endDate });
      await updateItem(itemId, item);
      return {
        success: true,
        message: `You rented this item : ${JSON.stringify(item)}`,
      };
    } else {
      return { success: false, message: "Item not available to rent" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const returnItem = async (id) => {
  try {
    let item = await getItemById(id);
    if (item && item.available === false) {
      //change availability to true and clear datRange because item is now returned
      item.available = true;
      item.startDate = "";
      item.endDate = "";
      await removeRental(id);
      await updateItem(id, item);
      return {
        sucess: true,
        message: `Item returned: ${JSON.stringify(item)}`,
      };
    } else {
      return { sucess: false, message: "Item not found" };
    }
  } catch (error) {
    return { sucess: false, message: error.message };
  }
};
