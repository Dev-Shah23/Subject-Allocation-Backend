import "dotenv/config";
import express from "express";

import authRoutes from "./src/routes/auth.routes.js";
import facultyRoutes from "./src/routes/faculty.routes.js";
import preferenceRoutes from "./src/routes/preference.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/preferences", preferenceRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
