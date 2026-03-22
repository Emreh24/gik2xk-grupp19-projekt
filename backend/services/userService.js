// services/userService.js - Affärslogik för användare
const { User } = require("../models");
const { getCartByUserId } = require("./cartService");

const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["password"] },
  });
};

const getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
};

const createUser = async (data) => {
  return await User.create(data);
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  return await user.update(data);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
};

const getUserCart = async (userId) => {
  return await getCartByUserId(userId);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserCart,
};