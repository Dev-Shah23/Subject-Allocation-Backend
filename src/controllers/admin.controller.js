// Admin controller placeholder
// TODO: implement controller methods
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // fetch admin from table `admin`
    const { data: admin, error } = await supabase
      .from("admin")   // lowercase as in your DB
      .select("*")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // compare password with hash
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // success
    return res.status(200).json({
      message: "Admin login successful",
      admin: {
        admin_id: admin.admin_id,
        email: admin.email
      }
    });

  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
