import "dotenv/config";

const development = process.argv.includes("--dev");
process.env.NODE_ENV ??= development ? "development" : "production";

export function createConfig(
  environment: Readonly<Record<string, string | undefined>>,
  isDevelopment: boolean,
) {
  const portName = isDevelopment ? "API_PORT" : "PORT";
  const defaultPort = isDevelopment ? 5001 : 3000;
  const value = environment[portName];
  const port = value === undefined ? defaultPort : Number(value);

  if (value?.trim() === "" || !Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${portName} must be an integer between 1 and 65535.`);
  }

  return {
    development: isDevelopment,
    port,
    host: environment.HOST ?? "0.0.0.0",
  };
}

export const config = createConfig(process.env, development);
