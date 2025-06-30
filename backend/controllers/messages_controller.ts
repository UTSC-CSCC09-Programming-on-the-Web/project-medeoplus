import express from "express";
import { Request, Response } from "express";
import Messages from "../models/Messages";

const messagesController = {
    async getMessagesForUser(req: Request, res: Response) {
        const userId = req.user ? req.user : 0; // Assuming req.user contains the user's ID
        const otherUserId = req.query.userId ? parseInt(req.query.userId as string, 10) : 0;
        if (!otherUserId) {
            res.status(400).json({
                error: "User ID is required",
            });
            return;
        }
        try {
            const userMessages = await Messages.getMessages(userId, otherUserId);
            res.json(userMessages);
        } catch (error) {
            res.status(500).json({
                error: "Internal server error while fetching messages",
            });
        }
    },

    async sendMessage(req: Request, res: Response) {
        const senderId = req.user ? req.user : 0; // Assuming req.user contains the sender's ID
        const { receiverId, text } = req.body;
        if (!receiverId || !text) {
            res.status(400).json({
                error: "Receiver ID and text are required",
            });
            return;
        }
        try {
            const newMessage = await Messages.sendMessage(senderId, receiverId, text);
            if (newMessage.status === "success" && newMessage.data) {
                res.status(201).json({
                    message: "Message sent successfully",
                    data: newMessage,
                });
            } else {
                res.status(400).json({
                    message: "Failed to send message",
                });
            }
        } catch (error) {
            res.status(500).json({
                error: "Internal server error while sending message",
            });
        }
    },
};

export default messagesController;
