import jwt from "jsonwebtoken";
export function generateToken(payload) {
    const { username, role, phoneNumber } = payload;
    
    if (!username || !role || !phoneNumber) {
      throw new Error("Token payload must include username, role, and phoneNumber");
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
    
    const tokenPayload = {
      username,
      role,
      phoneNumber,
    };
    
    const token = jwt.sign(tokenPayload, secret, {
      expiresIn: "1h",
    });
    
    return token;
  }

  export function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
    
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      } else {
        throw new Error("Token verification failed");
      }
    }
  }