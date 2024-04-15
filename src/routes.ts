import express from "express";
import { accountRouter } from "./routes/accountRouter";
import { rideRouter } from "./routes/rideRouter";

const app = express();
app.use(express.json());

// Rotas
app.use("/account", accountRouter);
app.use("/ride", rideRouter);

export { app };
