import express from "express";
import {
    comment,
    createPost,
    getPost,
    like,
} from "../controllers/post.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const postRouter = express.Router();

postRouter.post("/createpost", isAuth, upload.single("image"), createPost);
postRouter.get("/getpost", isAuth, getPost);
postRouter.get("/like/:id", isAuth, like);
postRouter.post("/comment/:id", isAuth, comment);

export default postRouter;
