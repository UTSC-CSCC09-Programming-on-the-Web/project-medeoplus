import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/Users";

const usersController = {
    signup(req: Request, res: Response) {
        const username = req.body.username as string;
        const email = req.body.email as string;
        const password = req.body.password as string;
        const existingUser = User.getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        try {
            const newUser = User.signup(email, username, password).data;
            if (!newUser) {
                res.status(500).json({ message: "Failed to create user" });
                return;
            }
            res.json({
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to create user" });
        }
    },

    login(req: Request, res: Response) {
        const email = req.body.email as string;
        const password = req.body.password as string;
        const user = User.getUserByEmail(email);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        try {
            const response = User.login(email, password);
            if (response.status === "error" || !response.data) {
                res.status(400).json({ message: response.message });
                return;
            }
            res.json({
                message: "User logged in successfully",
                token: response.data,
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to login user" });
        }
    },

    getOwnUser(req: Request, res: Response) {
        const userId = parseInt(req.query.userId as string, 10);
        const user = User.getUser(userId).data;
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        try {
            res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to retrieve user" });
        }
    }
}

export default usersController;