import app from "../app.js";
import { AppError } from "../middleware/errorHandler.js";
import * as roomService from "../services/room.js";

export const getRoom = async (req, res, next) => {
  try {
    const data = await roomService.getRoom();
    res.status(200).json({ data: data });
  } catch (err) {
    throw new AppError("Error fetching users", 500, err);
  }
};
export const getZoneByRoomId = async (req, res) => {
  const room_id = req.params.id;

  try {
    const data = await roomService.getZoneByRoomId(room_id);
    res.status(200).json({ data: data });
  } catch (err) {
    throw new AppError("Error fetching users", 500, err);
  }
};
export const getRowByZone = async (req, res) => {
  const zone = req.params.id;
  try {
    const data = await roomService.getRowByZone(zone);
    res.status(200).json({ data: data });
  } catch (error) {
    throw new AppError("server error ", error);
  }
};
export const getSlotByZoneRow = async (req, res) => {
  const { zone, row_no, room } = req.params;

  try {
    const data = await roomService.getSlotByZoneRow(room, zone, row_no);
    res.status(200).json({ data: data });
  } catch (error) {
    throw new AppError("server error", error);
  }
};
export const getLocationMapByZone = async (req, res, next) => {
  try {
    const { zone, room_id } = req.params;

    const data = await roomService.getAvailableOccupiedByZone(room_id, zone);
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
