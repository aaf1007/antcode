import "./config.ts";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth, trustedProxies } from "./auth/auth.ts";
import problemRouter from "./routes/problem.routes.ts";
import { errorHandler } from "./middleware/error-handler.ts";

const app = express();
app.disable("x-powered-by");
if (trustedProxies.length) app.set("trust proxy", trustedProxies);
app.use("/api/auth", (request, _response, next) => {
  // Express checks the socket peer against the configured proxy list before using forwarded IPs.
  const clientIp = request.ip;
  if (clientIp) request.headers["x-forwarded-for"] = clientIp;
  else delete request.headers["x-forwarded-for"];
  next();
});
// Better Auth must receive the raw body before Express's JSON parser consumes it.
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use("/api/problem", problemRouter);
// Return JSON for unknown API paths instead of Express's default HTML 404 page.
app.use("/api", (_request, response) => {
  response.status(404).json({ error: "API route not found." });
});

app.use(errorHandler);

export default app;
