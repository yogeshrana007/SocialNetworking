import bcrypt from "bcrypt";
import genToken from "../config/token.js";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
    try {
        let { firstName, lastName, userName, email, password } = req.body;
        let isEmail = await User.findOne({ email });
        if (isEmail) {
            return res.status(400).json({ message: "email already exist !" });
        }
        let isUsername = await User.findOne({ userName });
        if (isUsername) {
            return res
                .status(400)
                .json({ message: "username already exist !" });
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: "password must contain atleast 8 characters!!",
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        // User is mongoose Model
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
        });
        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite:
                process.env.NODE_ENVIRONMENT === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENVIRONMENT === "production", // true on prod (HTTPS)
        });

        return res.status(201).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "signup error" });
    }
};

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "User not found. Please sign up!" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite:
                process.env.NODE_ENVIRONMENT === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENVIRONMENT === "production", // true on prod (HTTPS)
        });

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "login error" });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "logout successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "logout error" });
    }
};
