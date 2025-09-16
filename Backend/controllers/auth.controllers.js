import bcrypt from "bcrypt";
import genToken from "../config/token.js";
import User from "../models/user.model.js";

const isProd = process.env.NODE_ENVIRONMENT === "production";

// Common cookie options for both signup and login
const cookieOpts = {
    httpOnly: true,
    path: "/", // send to all routes [10]
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: isProd ? "none" : "lax", // cross-site requires "none" [1][20]
    secure: isProd, // must be true when sameSite is "none" [1][20]
    // DO NOT set domain; let browser infer it to avoid mismatches on Vercel [3]
};

export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;

        const isEmail = await User.findOne({ email });
        if (isEmail)
            return res.status(400).json({ message: "email already exist !" });

        const isUsername = await User.findOne({ userName });
        if (isUsername)
            return res
                .status(400)
                .json({ message: "username already exist !" });

        if (!password || password.length < 8) {
            return res
                .status(400)
                .json({
                    message: "password must contain atleast 8 characters!!",
                });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
        });

        const token = await genToken(user._id);

        // ⚡ return user + token (no cookie)
        return res.status(201).json({ user, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "signup error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(400)
                .json({ message: "User not found. Please sign up!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Incorrect Password" });

        const token = await genToken(user._id);

        // ⚡ return user + token (no cookie)
        return res.status(200).json({ user, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "login error" });
    }
};

export const logOut = async (req, res) => {
    try {
        // Clear with matching attributes, otherwise browsers may keep it
        res.clearCookie("token", {
            path: "/",
            sameSite: isProd ? "none" : "lax",
            secure: isProd,
            httpOnly: true,
        }); // ensure deletion for cross-site cookie [9]

        return res.status(200).json({ message: "logout successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "logout error" });
    }
};
