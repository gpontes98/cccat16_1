import express from "express";
import { getAccountController } from "../controllers/getAccountController";
import { signupController } from "../controllers/signupController";

const accountRouter = express.Router();

accountRouter.post("/", signupController);
accountRouter.get("/:accountId", getAccountController);

export { accountRouter };
