import express from "express";
import {
  getRoom,
  getRowByZone,
  getSlotByZoneRow,
  getZoneByRoomId,
  getLocationMapByZone,
} from "../controllers/room.js";

const router = express.Router();

router.get("/", getRoom);
router.get("/zone/:id", getZoneByRoomId);
router.get("/row/:id", getRowByZone);
router.get("/slot/:room/:zone/:row_no", getSlotByZoneRow);
router.get("/slot/:room/:zone", getSlotByZoneRow);
router.get("/locations/:room_id/:zone", getLocationMapByZone);
export default router;
