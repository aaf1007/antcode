import cors from "cors";
import express, { Router, type Express, type Request, type Response } from "express";
import problemRouter from "./routes/problem.route.js";
import userRouter from "./routes/user.route.js";

const app:Express = express();
const router = Router();

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173',
    }
));

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello antcode users");
});


app.use("/api/user", userRouter);
app.use("/api/problem", problemRouter);

export default app;