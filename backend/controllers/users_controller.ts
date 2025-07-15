import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/Users.js";

const usersController = {
    async signup(req: Request, res: Response) {
        const username = req.body.username as string;
        const email = req.body.email as string;
        const password = req.body.password as string;
        const existingUser = await User.getUserByEmail(email);
        if (existingUser.status === "success" && existingUser.data) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        try {
            const newUser = (await User.signup(email, username, password)).data;
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

    async login(req: Request, res: Response) {
        const email = req.body.email as string;
        const password = req.body.password as string;
        const user = await User.getUserByEmail(email);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        try {
            const response = await User.login(email, password);
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

    async getOwnUser(req: Request, res: Response) {
        if (!req.user) {
            res.json({ message: "Not logged in", user: null });
        }
        const userId: number = req.user ?? 0; 
        const user = (await User.getUser(userId)).data;
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        try {
            res.json({
                message: "User retrieved successfully",
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