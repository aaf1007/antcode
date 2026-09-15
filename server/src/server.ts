import { config } from "./config.ts";
import app from "./app.ts";

const { port, host } = config;
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("The server port must be an integer between 1 and 65535.");
}

const server = app.listen(port, host, () => {
  console.log(`AntCode API listening on http://localhost:${port}`);
});

server.on("error", (error) => {
  console.error("Failed to start AntCode", error);
  process.exit(1);
});
