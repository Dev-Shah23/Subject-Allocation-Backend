import express from "express"
import bcrypt from "bcrypt"
import supabase from "../config/supabase.js"

const router = express.Router()

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  const { data: admin } = await supabase
    .from("admin")
    .select("*")
    .eq("email", email)
    .single()

  if (!admin) {
    return res.status(401).json({ message: "Invalid email" })
  }

  const match = await bcrypt.compare(password, admin.password_hash)

  if (!match) {
    return res.status(401).json({ message: "Invalid password" })
  }

  res.json({
    message: "Login successful",
    adminId: admin.admin_id
  })
})

export default router   