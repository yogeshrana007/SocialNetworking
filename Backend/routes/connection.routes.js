import express from "express";
import {
    acceptConnection,
    getConnectionRequests,
    getConnectionStatus,
    getUserConnections,
    rejectConnection,
    removeConnection,
    sendConnection,
} from "../controllers/connection.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const connectionRouter = express.Router();

connectionRouter.post("/send/:id", isAuth, sendConnection);
connectionRouter.put("/accept/:connectionId", isAuth, acceptConnection);
connectionRouter.put("/reject/:connectionId", isAuth, rejectConnection);
connectionRouter.get("/getstatus/:userId", isAuth, getConnectionStatus);
connectionRouter.delete("/remove/:id", isAuth, removeConnection);
connectionRouter.get("/requests", isAuth, getConnectionRequests);
connectionRouter.get("/", isAuth, getUserConnections);

export default connectionRouter;
