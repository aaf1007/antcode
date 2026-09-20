import { config } from "./config.ts";
import app from "./app.ts";

const server = app.listen(config.port, config.host, () => {
  console.log(`AntCode API listening on http://localhost:${config.port}`);
});

server.on("error", (error) => {
  console.error("Failed to start AntCode", error);
  process.exit(1);
});
