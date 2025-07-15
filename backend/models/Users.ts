import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Result from "../types/Result.js";
import prisma from "../prisma/db.js";
import dotenv from "dotenv";
dotenv.config();

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

const Users = {
    async signup(email: string, username: string, password: string): Promise<Result<User>> {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email: email },
            });
            if (existingUser) {
                return {
                    status: "error",
                    message: "User already exists",
                };
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            // Save the new user to the database using Prisma
            const newUser = await prisma.user.create({
                data: {
                    name: username,
                    email: email,
                    password: hashedPassword,
                },
            });
            return {
                status: "success",
                message: "User created successfully",
                data: newUser,
            };
        } catch (error) {
            throw new Error(`Failed to create user: ${error}`);
        }
    },

    async login(email: string, password: string) : Promise<Result<string>> {
        try {
            const user = await prisma.user.findUnique({
                where: { email: email },
            });
            if (!user) {
                return {
                    status: "error",
                    message: "User not found",
                };
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!user || !isPasswordValid) {
                return {
                    status: "error",
                    message: "Invalid email or password",
                };
            }
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: "1d",
                }
            );
            return {
                status: "success",
                message: "User logged in successfully",
                data: token
            };
        } catch (error) {
            throw new Error(`Failed to login user: ${error}`);
        }
    },

    async getUser(userId: number) : Promise<Result<User>> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        return {
            status: user ? "success" : "error",
            message: user ? "User found" : "User not found",
            data: user ? user : undefined,
        };
    },
    
    async getUserByEmail(email: string): Promise<Result<User>> {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return {
                status: "error",
                message: "User not found",
            };
        }
        return {
            status: "success",
            message: "User found",
            data: user,
        };
    }
}

export default Users;