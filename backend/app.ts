import express from "express"
import usersRouter from "./routers/users_router.js";
import messagesRouter from "./routers/messages_router.js";
import { translate } from "@vitalets/google-translate-api";
import { Request, Response } from "express";

//create express app for backend at port 3000
import cors from "cors";
const corsOptions = {
    origin: "http://localhost:5173", // default Vue dev server port
    credentials: true,
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("frontend"));

//create api endpoint for users
app.use("/api/users", usersRouter);

//create api endpoint for messages
app.use("/api/messages", messagesRouter);

app.post('/api/translate', async (req: Request, res: Response) => {
  const { text, to } = req.body;
  if (!text || !to) {
    res.status(400).json({ error: 'Missing text or target language' });
    return;
  }

  try {
    const result = await translate(text, { to });
    res.json({ translated: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

//set the port for the backend app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
