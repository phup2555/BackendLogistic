export function errorHandler(err, res, req, next) {
  console.error(err);
  res.status(err?.statusCode).json({
    message: err.message || "Internal Server Error",
    data: err.data || null,
  });
}

export class AppError extends Error {
  constructor(message, statusCode = 400, data = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = data;
    // Error.captureStackTrace(this, this.constructor);
  }
}
