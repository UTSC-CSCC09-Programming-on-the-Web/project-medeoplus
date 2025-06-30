import prisma from "../prisma/db";
import Result from "../types/Result";

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    text: string;
    createdAt: Date;
}

const Messages = {
    async getMessagesForUser(userId: number): Promise<Result<Message[]>> {
        try {
            // Fetch messages from the database using Prisma
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { receiverId: userId },
                        { senderId: userId }
                    ]
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return {
                status: "success",
                message: "Messages fetched successfully",
                data: messages,
            };
        } catch (error) {
            throw new Error(`Failed to fetch messages: ${error}`);
        }
    },

    async getMessages(userId: number, otherUserId: number): Promise<Result<Message[]>> {
        try {
            // Fetch messages between two users from the database using Prisma
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userId, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: userId }
                    ]
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return {
                status: "success",
                message: "Messages fetched successfully",
                data: messages,
            };
        } catch (error) {
            throw new Error(`Failed to fetch messages: ${error}`);
        }
    },

    async sendMessage(senderId: number, receiverId: number, text: string): Promise<Result<Message>> {
        try {
            // Create a new message in the database using Prisma
            const newMessage = await prisma.message.create({
                data: {
                    senderId,
                    receiverId,
                    text,
                },
            });
            return {
                status: "success",
                message: "Message sent successfully",
                data: newMessage,
            };
        } catch (error) {
            throw new Error(`Failed to send message: ${error}`);
        }
    },
};

export default Messages;