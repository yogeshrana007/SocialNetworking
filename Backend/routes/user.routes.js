import express from "express";
import {
    getCurrentUser,
    getUserById,
    updateProfile,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

let userRouter = express.Router();

userRouter.get("/currentuser", isAuth, getCurrentUser);
userRouter.put(
    "/updateprofile",
    isAuth,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    updateProfile
);

userRouter.get("/:id", isAuth, getUserById);

export default userRouter;
