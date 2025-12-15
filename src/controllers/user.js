import { AppError } from "../middleware/errorHandler.js";
import * as Service from "../services/user.js";
import { verifyPassword } from "../util/encrypt.js";
import { generateToken } from "../util/token.js";

export const Login = async (req, res) => {
  const { username, password } = req.body;
  // console.log({ username });
  try {
    if (!username || !password) {
      return res.status(400).json({
        message: "ກະລຸນາກອກ username ແລະ password",
      });
    }
    const user = await Service.findUserByUsername(username);
    // console.log({ user });
    if (!user) {
      return res.status(400).json({ message: "ບໍ່ພົບຜູ້ຊື່ໃຊ້ນີ້" });
    }
    const isPaswordCorrect = verifyPassword(password, user.password);
    if (!isPaswordCorrect) {
      return res
        .status(402)
        .json({ message: "ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ" });
    }
    if (user.role !== "LogisAdminnn" || user.role !== "UserLogistic") {
      return res.status(403).json({ message: "ບໍ່ມີສິດເຂົ້າສູ່ລະບົບ" });
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
    res.status(500).json({ message: "Server error Cannot login" });
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
    // console.log({ checkUserUnique });
    if (!checkUserUnique) {
      return res.status(400).json({ message: "ຊື່ຜູ້ໃຊ້ນີ້ມີແລ້ວ" });
    }
    const user = await Service.createUser(req.body);
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error Cannot login" });
    throw new AppError("Error creating user", 500, error);
  }
};
