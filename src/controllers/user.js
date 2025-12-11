import { AppError } from "../middleware/errorHandler.js";
import * as Service from "../services/user.js";
import { verifyPassword } from "../util/encrypt.js";
import { generateToken } from "../util/token.js";

export const Login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({
        message: "ກະລຸນາກອກ username ແລະ password",
      });
    }
    const user = await Service.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "ບໍ່ພົບຜູ້ໃຊ້ນີ້" });
    }
    const isPaswordCorrect = verifyPassword(password, user.password);
    if (!isPaswordCorrect) {
      throw new AppError("ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ", 401);
    }

    const token = generateToken({
      username: user.username,
      role: user.role,
      phoneNumber: user.phoneNumber,
    });
    res.json({
      message: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
      token,
      result: {
        username: user.username,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.log({ error });
    throw new AppError("Error during login", 500, error);
  }
};

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
    const checkUserUnique = await Service.checkUsernameUnique(
      req.body.username
    );
    console.log({ checkUserUnique });
    if (!checkUserUnique) {
      return res.status(400).json({ message: "ຊື່ຜູ້ໃຊ້ນີ້ມີແລ້ວ" });
    }
    const user = await Service.createUser(req.body);
    res.json({ data: user });
  } catch (error) {
    throw new AppError("Error creating user", 500, error);
  }
};
