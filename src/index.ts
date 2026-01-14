// index.ts
import { fromHono } from "chanfana";
import { Hono } from "hono";
import { GetFlag } from "./endpoints/flag";

const app = new Hono();
const openapi = fromHono(app, {
    docs_url: "/",
    openapi: "3.0.0",
});

// THIS LINE IS THE KEY:
// If you want to hit /api/flags/in, the path MUST be "/api/flags/:identifier"
openapi.get("/api/flags/:identifier", GetFlag);

export default app;
