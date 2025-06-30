import messagesController from "../controllers/messages_controller"
import { Router } from "express";
import authorizeUser from "../middleware/authorizeUser";

const messagesRouter = Router();

//create api endpoint for getting messages for the logged-in user to another user
messagesRouter.get("/:userId", authorizeUser, messagesController.getMessagesForUser);

// send a new message to another user
messagesRouter.post("/", authorizeUser, messagesController.sendMessage);

export default messagesRouter;