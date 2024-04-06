import express from "express";
import { getAccountController } from "../controllers/getAccountController";

const getAccountRouter = express.Router();

getAccountRouter.get("/:accountId", getAccountController);

export { getAccountRouter };
