import crypto from "crypto";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 32, "sha512")
    .toString("base64");

  return `${salt}:${hash}`;
}

export function verifyPassword(password, hashedPassword) {
  const [salt, hash] = hashedPassword.split(":");

  if (!salt || !hash) {
    return false;
  }
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 10000, 32, "sha512")
    .toString("base64");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
}
