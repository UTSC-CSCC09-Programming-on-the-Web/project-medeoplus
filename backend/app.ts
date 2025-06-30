import express from "express"
import usersRouter from "./routers/users_router";
import messagesRouter from "./routers/messages_router";
import documentsRouter from "./routers/documents_router";

//create express app for backend at port 3000
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));


//create api endpoint for users
app.use("/api/users", usersRouter);

//create api endpoint for messages
app.use("/api/messages", messagesRouter);

//create api endpoint for documents
app.use("/api/documents", documentsRouter);
