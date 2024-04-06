import express from "express";
import { signupRouter } from "./routes/signupRouter";
import { getAccountRouter } from "./routes/getAccountRouter";

const app = express();
app.use(express.json());

// Rotas
app.use("/signup", signupRouter);
app.use("/getaccount", getAccountRouter);

export { app };
