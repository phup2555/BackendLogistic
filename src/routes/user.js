import express from "express";
import { createUser, getUsers, Login } from "../controllers/user.js";
const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.post("/login", Login);
export default router;
