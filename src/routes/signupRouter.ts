import express from "express";
import { signupController } from "../controllers/signupController";

const signupRouter = express.Router();

signupRouter.post("/", signupController);

export { signupRouter };
