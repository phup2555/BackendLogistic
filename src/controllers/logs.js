import { AppError } from "../middleware/errorHandler.js";
import * as logsService from "../services/logs.js";
export const getLogs = async (req, res, next) => {
  try {
    const data = await logsService.getLogs();
    res.status(200).json({ data: data });
  } catch (err) {
    next(err);
    throw new AppError("Server error cannot get logs", 500, err);
  }
};
