import "./config.ts";
import express from "express";
import problemRouter from "./routes/problem.routes.ts";
import { errorHandler } from "./middleware/error-handler.ts";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use("/api/problem", problemRouter);
// Return JSON for unknown API paths instead of Express's default HTML 404 page.
app.use("/api", (_request, response) => {
  response.status(404).json({ error: "API route not found." });
});

app.use(errorHandler);

export default app;
