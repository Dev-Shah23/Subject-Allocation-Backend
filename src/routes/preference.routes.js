import express from "express";
import { submitPreferences } from "../controllers/preference.controller.js";

const router = express.Router();

router.post("/", submitPreferences);

export default router;
