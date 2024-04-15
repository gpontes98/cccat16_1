import express from "express";
import { startRideController } from "../controllers/startRideController";
import { getRideController } from "../controllers/getRideController";

const rideRouter = express.Router();

rideRouter.post("/", startRideController);
rideRouter.get("/:rideId", getRideController);

export { rideRouter };
