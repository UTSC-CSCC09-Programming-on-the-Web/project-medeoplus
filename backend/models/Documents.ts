interface Document {
    id: number;
    title: string;
    content: string;
    ownerId: number;
    createdAt: Date;
}

const documents: Document[] = [];
let documentIdCounter: number = 1;

const Documents = {
    getDocumentsForUser(userId: number): Document[] {
        return documents.filter(doc => doc.ownerId === userId);
    },

    createDocument(title: string, content: string, ownerId: number): Document {
        const newDocument: Document = {
            id: documentIdCounter++,
            title,
            content,
            ownerId,
            createdAt: new Date(),
        };
        documents.push(newDocument);
        return newDocument;
    },

    updateDocument(id: number, title: string, content: string): Document | null {
        const docIndex = documents.findIndex(doc => doc.id === id);
        if (docIndex === -1) return null;

        documents[docIndex].title = title;
        documents[docIndex].content = content;
        return documents[docIndex];
    },

    deleteDocument(id: number): boolean {
        const docIndex = documents.findIndex(doc => doc.id === id);
        if (docIndex === -1) return false;

        documents.splice(docIndex, 1);
        return true;
    },
};

export default Documents;