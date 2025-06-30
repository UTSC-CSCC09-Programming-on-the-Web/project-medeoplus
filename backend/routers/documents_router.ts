import documentsController from "../controllers/documents_controller";
import { Router } from "express";

const documentsRouter: Router = Router();

// Create API endpoint for getting documents for a user
documentsRouter.get("/:userId", documentsController.getDocumentsForUser);

// Create API endpoint for creating a new document
documentsRouter.post("/", documentsController.createDocument);

export default documentsRouter;

