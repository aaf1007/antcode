import "dotenv/config";

const development = process.argv.includes("--dev");
process.env.NODE_ENV ??= development ? "development" : "production";

export const config = {
  development,
  port: Number(process.env[development ? "API_PORT" : "PORT"] ?? (development ? 5001 : 3000)),
  host: process.env.HOST ?? "0.0.0.0",
};
