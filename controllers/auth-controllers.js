import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import User from "../models/user-model.js"; // your mongoose model
import dotenv from "dotenv"

dotenv.config()


export const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // 1️⃣ Basic field validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        console.log("here")

        // 2️⃣ Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // 3️⃣ Password strength validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // 4️⃣ Confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // 5️⃣ Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // 6️⃣ Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 7️⃣ Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 8️⃣ Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

         // 9️⃣ Send JWT as HttpOnly cookie
        res.cookie("token", token, {
        httpOnly: true, // not accessible by JS
        sameSite: "strict", // prevent CSRF
        secure: process.env.NODE_ENV === "production", 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  

        // 9️⃣ Remove password before sending response
        user.password = undefined;

        // 🔟 Send response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.error("Signup Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const signin = async (req, res) => {
    try {
        const {email, password} = req.body;

        console.log("password", password)

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter name and password"
            })
        }

        console.log("password", password)

        // Also get password of user
        // By default the user model does not return password
        const user = await User.findOne({email}).select("+password");

        console.log("user password", user.password)

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials Entered"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials Entered"
            })
        }

        // 8️⃣ Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

         // 9️⃣ Send JWT as HttpOnly cookie
        res.cookie("token", token, {
        httpOnly: true, // not accessible by JS
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  

        // 9️⃣ Remove password before sending response
        user.password = undefined;

        // 🔟 Send response
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });

    } catch (error) {
        console.error("Signin Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const logout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
  
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
  
    } catch (error) {
      console.error("Logout Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
