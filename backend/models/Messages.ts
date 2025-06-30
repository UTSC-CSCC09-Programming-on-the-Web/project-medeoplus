interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    text: string;
    createdAt: Date;
}

const messages: Message[] = [];
let messageIdCounter: number = 1;

const Messages = {
    getMessagesForUser(userId: number): Message[] {
        return messages.filter(
            message => message.receiverId === userId || message.senderId === userId
        );
    },

    sendMessage(senderId: number, receiverId: number, text: string): Message {
        const newMessage: Message = {
            id: messageIdCounter++,
            senderId,
            receiverId,
            text,
            createdAt: new Date(),
        };
        messages.push(newMessage);
        return newMessage;
    },
};

export default Messages;