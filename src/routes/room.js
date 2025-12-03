import express from "express";
import {
  getRoom,
  getRowByZone,
  getSlotByZoneRow,
  getZoneByRoomId,
} from "../controllers/room.js";

const router = express.Router();

router.get("/", getRoom);
router.get("/zone/:id", getZoneByRoomId);
router.get("/row/:id", getRowByZone);
router.get("/slot/:room/:zone/:row_no", getSlotByZoneRow);
export default router;
