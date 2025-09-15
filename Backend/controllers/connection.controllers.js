import { io, userSocketMap } from "../index.js";
import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";

export const sendConnection = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.userId;

        const sender = await User.findById(senderId);

        if (senderId === receiverId) {
            return res
                .status(400)
                .json({ message: "You can't send request to yourself" });
        }

        if (sender.connection.includes(receiverId)) {
            return res
                .status(400)
                .json({ message: "You are already connected" });
        }

        const existingPending = await Connection.findOne({
            sender: senderId,
            receiver: receiverId,
            status: "pending",
        });

        if (existingPending) {
            return res.status(400).json({ message: "Request already pending" });
        }

        const newRequest = await Connection.create({
            sender: senderId,
            receiver: receiverId,
        });

        const receiverSocketId = userSocketMap.get(receiverId);
        const senderSocketId = userSocketMap.get(senderId);

        // Notify receiver that they have a received request (updatedUserId is the sender's id)
        if (receiverSocketId)
            io.to(receiverSocketId).emit("statusUpdate", {
                updatedUserId: senderId.toString(),
                newStatus: "received",
                requestId: newRequest._id,
            });

        // Notify sender that their request is now pending (updatedUserId is the receiver's id)
        if (senderSocketId)
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: receiverId.toString(),
                newStatus: "pending",
                requestId: newRequest._id,
            });

        return res.status(200).json(newRequest);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: `Send connection error: ${error.message}` });
    }
};

export const acceptConnection = async (req, res) => {
    try {
        const { connectionId } = req.params;
        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res
                .status(400)
                .json({ message: "Connection does not exist" });
        }

        if (connection.receiver.toString() !== req.userId.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to accept this request" });
        }

        if (connection.status !== "pending") {
            return res
                .status(400)
                .json({ message: "Request already processed" });
        }

        connection.status = "accepted";
        await connection.save();

        await User.findByIdAndUpdate(req.userId, {
            $addToSet: { connection: connection.sender },
        });
        await User.findByIdAndUpdate(connection.sender, {
            $addToSet: { connection: req.userId },
        });

        const receiverSocketId = userSocketMap.get(
            connection.receiver.toString()
        );
        const senderSocketId = userSocketMap.get(connection.sender.toString());

        // Emit to the receiver's socket: the other user (sender) is now connected ("disconnect" from the perspective of the button)
        if (receiverSocketId)
            io.to(receiverSocketId).emit("statusUpdate", {
                updatedUserId: connection.sender.toString(),
                newStatus: "disconnect",
            });

        // Emit to the sender's socket: the other user (receiver) is now connected
        if (senderSocketId)
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: req.userId.toString(),
                newStatus: "disconnect",
            });

        return res.status(200).json({ message: "Connection accepted" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: `Connection accept error: ${error.message}` });
    }
};

export const rejectConnection = async (req, res) => {
    try {
        const { connectionId } = req.params;
        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res
                .status(400)
                .json({ message: "Connection does not exist" });
        }

        if (connection.status !== "pending") {
            return res.status(400).json({ message: "Request under process" });
        }

        connection.status = "rejected";
        await connection.save();

        // Notify both parties that the request was rejected (they should see "connect")
        const receiverSocketId = userSocketMap.get(
            connection.receiver.toString()
        );
        const senderSocketId = userSocketMap.get(connection.sender.toString());

        if (receiverSocketId)
            io.to(receiverSocketId).emit("statusUpdate", {
                updatedUserId: connection.sender.toString(),
                newStatus: "connect",
            });

        if (senderSocketId)
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: connection.receiver.toString(),
                newStatus: "connect",
            });

        return res.status(200).json({ message: "Connection rejected" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: `Connection reject error: ${error.message}` });
    }
};

export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.userId;

        const currentUser = await User.findById(currentUserId);

        // If they already are in each other's connection list -> disconnect
        const alreadyConnected = (currentUser.connection || []).some(
            (id) => id.toString() === targetUserId.toString()
        );

        if (alreadyConnected) {
            return res.json({ status: "disconnect" });
        }

        // Check for any pending Connection between the two
        const pendingRequest = await Connection.findOne({
            $or: [
                { sender: currentUserId, receiver: targetUserId },
                { sender: targetUserId, receiver: currentUserId },
            ],
            status: "pending",
        });

        if (pendingRequest) {
            if (pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({
                    status: "pending",
                    requestId: pendingRequest._id,
                });
            } else {
                return res.json({
                    status: "received",
                    requestId: pendingRequest._id,
                });
            }
        }

        return res.json({ status: "connect" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: `Get connection status error: ${error.message}` });
    }
};

export const removeConnection = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.userId;

        const currentUser = await User.findByIdAndUpdate(
            currentUserId,
            { $pull: { connection: targetUserId } },
            { new: true }
        );

        const targetUser = await User.findByIdAndUpdate(
            targetUserId,
            { $pull: { connection: currentUserId } },
            { new: true }
        );

        await Connection.findOneAndDelete({
            $or: [
                { sender: currentUserId, receiver: targetUserId },
                { sender: targetUserId, receiver: currentUserId },
            ],
        });

        const receiverSocketId = userSocketMap.get(targetUserId);
        const senderSocketId = userSocketMap.get(currentUserId);

        if (receiverSocketId)
            io.to(receiverSocketId).emit("statusUpdate", {
                updatedUserId: currentUserId.toString(),
                newStatus: "connect",
            });

        if (senderSocketId)
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: targetUserId.toString(),
                newStatus: "connect",
            });

        return res.json({
            message: "Connection removed successfully!",
            currentUserConnections: currentUser.connection,
            targetUserConnections: targetUser.connection,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.userId;

        const requests = await Connection.find({
            receiver: userId,
            status: "pending",
        }).populate(
            "sender",
            "firstName lastName email userName profileImage headline"
        );

        return res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: `Get connection request error: ${error.message}`,
        });
    }
};

export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate(
            "connection",
            "firstName lastName userName profileImage headline connection"
        );

        return res.json(user.connection);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: `Get user connection error: ${error.message}` });
    }
};
