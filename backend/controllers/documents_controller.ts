import express from "express";
import Documents from "../models/Documents";

const documentsController = {
    getDocumentsForUser(req: express.Request, res: express.Response) {
        try {
            const userId = parseInt(req.params.userId, 10);
            const userDocuments = Documents.getDocumentsForUser(userId);
            res.json(userDocuments);
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while fetching documents",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },

    createDocument(req: express.Request, res: express.Response) {
        try {
            const { userId, title, content } = req.body;
            const newDocument = Documents.createDocument(userId, title, content);
            if (newDocument) {
                res.status(201).json({
                    message: "Document created successfully",
                    data: newDocument,
                });
            } else {
                res.status(400).json({
                    message: "Failed to create document",
                });
            }
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while creating the document",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },
};

export default documentsController;