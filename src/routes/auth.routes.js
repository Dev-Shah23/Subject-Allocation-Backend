import dotenv from "dotenv";
dotenv.config();
import express from "express";
import facultyRoutes from "./faculty.routes.js";
import adminRoutes from "./admin.routes.js";

const router = express.Router();

router.use("/faculty", facultyRoutes);
router.use("/admin", adminRoutes);

export default router;
