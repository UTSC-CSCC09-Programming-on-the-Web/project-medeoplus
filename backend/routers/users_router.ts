import express, { Request, Response } from "express";
import Users from "../models/Users";
import usersController from "../controllers/users_controller";
import authorizeUser from "../middleware/authorizeUser";

const usersRouter = express.Router();

//create api endpoint for signup
usersRouter.post("/signup", usersController.signup);

//create api endpoint for login
usersRouter.get("/login", usersController.login);

//create api endpoint for getting user profile
usersRouter.get("/me", authorizeUser, usersController.getOwnUser);

export default usersRouter;
