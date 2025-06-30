import express from "express";
import Documents from "../models/Documents";

const documentsController = {
    async getDocumentsForUser(req: express.Request, res: express.Response) {
        try {
            const userId = parseInt(req.params.userId, 10);
            const userDocuments = await Documents.getDocumentsForUser(userId);
            res.json(userDocuments);
        } catch (error) {
            res.status(500).json({
                message: "An internal server error occurred while fetching documents",
            });
        }
    },

    async createDocument(req: express.Request, res: express.Response) {
        try {
            const { userId, title, content } = req.body;
            const newDocument = await Documents.createDocument(userId, title, content);
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
                message: "An internal server error occurred while creating the document",
            });
        }
    },
};

export default documentsController;