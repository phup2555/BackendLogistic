import { AppError } from "../middleware/errorHandler.js";
import * as Service from "../services/user.js";

export const getUsers = async (req, res) => {
  try {
    const result = await Service.getUsers();
    res.json({ data: result });
  } catch (error) {
    throw new AppError("Error fetching users", 500, error);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await Service.createUser(req.body);
    res.json({ data: user });
  } catch (error) {
    throw new AppError("Error creating user", 500, error);
  }
};
