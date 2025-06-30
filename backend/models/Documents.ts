import prisma from "../prisma/db";
import Result from "../types/Result";

interface Document {
    id: number;
    title: string;
    content: string;
    ownerId: number;
    createdAt: Date;
}

const Documents = {
    async getDocumentsForUser(userId: number): Promise<Result<Document[]>> {
        try {
            const userDocuments = await prisma.document.findMany({
                where: { ownerId: userId },
                orderBy: { createdAt: 'desc' },
            });

            return {
                status: "success",
                message: "Documents fetched successfully",
                data: userDocuments,
            };
        } catch (error) {
            throw new Error(`Failed to fetch documents: ${error}`);
        }
    },

    async createDocument(title: string, content: string, ownerId: number): Promise<Result<Document>> {
        try {
            const newDocument = await prisma.document.create({
                data: {
                    title,
                    content,
                    ownerId,
                },
            });
            return {
                status: "success",
                message: "Document created successfully",
                data: newDocument,
            };
        } catch (error) {
            throw new Error(`Failed to create document: ${error}`);
        }
    },

    async updateDocument(id: number, title: string, content: string): Promise<Result<Document>> {
        try {
            const existingDocument = await prisma.document.findUnique({
                where: { id },
            });
            if (!existingDocument) {
                return {
                    status: "error",
                    message: "Document not found",
                };
            }
            const updatedDocument = await prisma.document.update({
                where: { id },
                data: {
                    title,
                    content,
                },
            });
            return {
                status: "success",
                message: "Document updated successfully",
                data: updatedDocument,
            }
        } catch (error) {
            throw new Error(`Failed to update document: ${error}`);
        }
    },

    async deleteDocument(id: number): Promise<Result<void>> {
        try {
            const docIndex = await prisma.document.findUnique({
                where: { id },
            });
            if (!docIndex) {
                return {
                    status: "error",
                    message: "Document not found",
                }
            }
            await prisma.document.delete({
                where: { id },
            });
            return {
                status: "success",
                message: "Document deleted successfully",
            };
        } catch (error) {
            throw new Error(`Failed to delete document: ${error}`);
        }
    },
};

export default Documents;