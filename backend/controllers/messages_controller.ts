import express from "express";
import { Request, Response } from "express";
import Messages from "../models/Messages";

const messagesController = {
    getMessagesForUser(req: Request, res: Response) {
        const userId = parseInt(req.params.userId, 10);
        try {
            const userMessages = Messages.getMessagesForUser(userId);
            res.json(userMessages);
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while fetching messages",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },

    sendMessage(req: Request, res: Response) {
        const { senderId, receiverId, text } = req.body;
        try {
            const newMessage = Messages.sendMessage(senderId, receiverId, text);
            if (newMessage) {
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
                message: "An error occurred while sending the message",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },
};

export default messagesController;
