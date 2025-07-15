import express, { Request, Response } from "express";
import Users from "../models/Users.js";
import usersController from "../controllers/users_controller.js";
import authorizeUser from "../middleware/authorizeUser.js";

const usersRouter = express.Router();

//create api endpoint for signup
usersRouter.post("/signup", usersController.signup);

//create api endpoint for login
usersRouter.post("/login", usersController.login);

//create api endpoint for getting user profile
usersRouter.get("/me", authorizeUser, usersController.getOwnUser);

export default usersRouter;
