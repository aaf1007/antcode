import { once } from "node:events";
import type { AddressInfo } from "node:net";
import type { TestContext } from "node:test";
import type { Express } from "express";

export async function serve(t: TestContext, app: Express) {
  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  await once(server, "listening");
  const { port } = server.address() as AddressInfo;
  return (path: string, init?: RequestInit) => fetch(`http://127.0.0.1:${port}${path}`, init);
}
