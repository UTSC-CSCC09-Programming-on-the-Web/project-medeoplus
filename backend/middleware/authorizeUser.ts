import express from "express";
import jwt from "jsonwebtoken";
import JwtPayload from "../types/JwtPayload";

export default function authorizeUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }

    try {
        const accessToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = accessToken.id; // Attach payload to request object
        req.email = accessToken.email; // Attach email to request object
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
    next();
}