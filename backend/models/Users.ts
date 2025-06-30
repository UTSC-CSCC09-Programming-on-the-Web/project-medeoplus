import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Result from "../types/Result";
import dotenv from "dotenv";
dotenv.config();

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

const users: User[] = [];

let userIdCounter: number = 1;

const Users = {
    signup(email: string, username: string, password: string): Result<User> {
        try {
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                return {
                    status: "error",
                    message: "User already exists",
                };
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser: User = {
                id: userIdCounter++,
                name: username,
                email: email,
                password: hashedPassword,
                createdAt: new Date(),
            };
            users.push(newUser);
            return {
                status: "success",
                message: "User created successfully",
                data: newUser,
            };
        } catch (error) {
            throw new Error(`Failed to create user: ${error}`);
        }
    },

    login(email: string, password: string) : Result<string> {
        try {
            const user = users.find(user => user.email === email);
            const isPasswordValid = bcrypt.compareSync(password, password);
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

    getUser(userId: number) : Result<User> {
        const user = users.find(user => user.id === userId);
        return {
            status: user ? "success" : "error",
            message: user ? "User found" : "User not found",
            data: user,
        };
    },
    
    getUserByEmail(email: string): Result<User> {
        const user = users.find(user => user.email === email);
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