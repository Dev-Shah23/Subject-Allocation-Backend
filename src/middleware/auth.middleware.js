import dotenv from "dotenv";
dotenv.config();
export const requireAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "No token" });
  }
  next();
};
