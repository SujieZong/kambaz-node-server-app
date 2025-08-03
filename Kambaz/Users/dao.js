import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  db.users.push(newUser);
  return newUser;
};

export const findAllUsers = () => db.users;

export const findUserById = (userId) =>
  db.users.find((user) => user._id === userId);

export const findUserByUsername = (username) =>
  db.users.find((user) => user.username === username);

export const findUserByCredentials = (username, password) =>
  db.users.find(
    (user) => user.username === username && user.password === password
  );
export const updateUser = (userId, userUpdates) => {
  const userIndex = db.users.findIndex((u) => u._id === userId);
  if (userIndex > -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...userUpdates };
    return db.users[userIndex];
  }
  return null;
};

export const deleteUser = (userId) => {
  const userIndex = db.users.findIndex((u) => u._id === userId);
  if (userIndex > -1) {
    const deletedUser = db.users[userIndex];
    db.users.splice(userIndex, 1);
    return deletedUser;
  }
  return null;
};
