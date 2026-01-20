import express from "express"
import facultyRoutes from "./faculty.routes.js"

const router = express.Router()

router.use("/faculty", facultyRoutes)

export default router
