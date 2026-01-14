// index.ts
import { fromHono } from "chanfana";
import { Hono } from "hono";
import { GetFlag } from "./endpoints/flag";
import { DocsPage } from "./endpoints/docs";

const app = new Hono();
const openapi = fromHono(app, {
    docs_url: "/openapi",
});

// Custom HTML documentation as primary landing page
openapi.get("/", DocsPage);

// Flag API endpoint
openapi.get("/api/flags/:identifier", GetFlag);

export default app;
