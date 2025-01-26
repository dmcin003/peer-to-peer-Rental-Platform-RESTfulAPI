import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
const defaultData = { items: [], rentals: [] };
const db = await JSONFilePreset("db.json", defaultData);

export const createItem = async (item) => {
  await readItems();
  db.data.items.push(item);
  await db.write();
};

export const readItems = async () => {
  await db.read();
  return db.data.items;
};

export const removeRental = async (id) => {
  await db.read();

  const index = db.data.rentals.map((rental) => rental.itemId).indexOf(id);

  db.data.rentals.splice(index, 1);
  await db.write();
};

export const readRentals = async () => {
  await db.read();
  return db.data.rentals || [];
};

export const addRental = async (rental) => {
  await db.read();
  db.data.rentals.push(rental);
  await db.write();
};

export const updateItem = async (id, updatedItem) => {
  const items = await readItems();
  const item = items.find((item) => item.id === id);
  if (item) {
    Object.assign(item, updatedItem);
    await db.write();
  } else {
    console.log("Item not found");
  }
};

export const getItemById = async (id) => {
  const items = await readItems();
  const item = items.find((item) => item.id === id);
  if (item) {
    return item;
  }
};
