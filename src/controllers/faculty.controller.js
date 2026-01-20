import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { supabase } from "../config/supabase.js";


const JWT_SECRET = process.env.JWT_SECRET

// ================= REGISTER FACULTY =================
export const registerFaculty = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Check if faculty already exists
        const { data: existing } = await supabase
            .from("faculty")
            .select("staff_id")
            .eq("email", email)
            .maybeSingle()

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Faculty already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const { data, error } = await supabase
            .from("faculty")
            .insert([
                {
                    staff_name: name,
                    email,
                    password: hashedPassword,
                    is_senior: role === "professor",
                    rank:
                        role === "assistant_professor" ? 1 :
                        role === "associate_professor" ? 2 : 3
                }
            ])
            .select()
            .single()

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }

        return res.status(201).json({
            success: true,
            message: "Faculty registered successfully",
            data
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// ================= LOGIN FACULTY =================
export const loginFaculty = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            })
        }

        const { data: faculty } = await supabase
            .from("faculty")
            .select("*")
            .eq("email", email)
            .single()

        if (!faculty) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, faculty.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign(
            { staff_id: faculty.staff_id, role: "faculty" },
            JWT_SECRET,
            { expiresIn: "1d" }
        )

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                faculty: {
                    staff_id: faculty.staff_id,
                    name: faculty.staff_name,
                    email: faculty.email,
                    rank: faculty.rank
                }
            }
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
        
    }
}
