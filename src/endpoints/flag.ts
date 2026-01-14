import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";

export class GetFlag extends OpenAPIRoute {
    schema = {
        tags: ["Flags"],
        summary: "Resolve Flag SVG",
        request: {
            params: z.object({
                identifier: z
                    .string()
                    .describe("2-letter country code or 'me'"),
            }),
        },
        responses: {
            "200": {
                description: "Returns the SVG icon",
                content: { "image/svg+xml": { schema: z.string() } },
            },
        },
    };

    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();
        const input = data.params.identifier.trim().toLowerCase();

        let countryCode: string;

        // 1. Resolve 'me' using Cloudflare's edge location data
        if (input === "me") {
            countryCode = (
                (c.req.raw.cf?.country as string) || "un"
            ).toLowerCase();
        } else {
            // 2. Otherwise assume it's a 2-letter code
            countryCode = input.slice(0, 2);
        }

        // 3. Fetch from the CDN
        const iconUrl = `https://flagcdn.com/${countryCode}.svg`;
        const response = await fetch(iconUrl);

        // 4. Robust Fallback: If code is wrong or CDN is down, return the UN flag
        if (!response.ok) {
            const fallback = await fetch("https://flagcdn.com/un.svg");
            const fallbackSvg = await fallback.text();
            return this.svgResponse(fallbackSvg);
        }

        const svgData = await response.text();
        return this.svgResponse(svgData);
    }

    // Helper method to ensure perfect SVG delivery for browsers
    private svgResponse(svg: string) {
        return new Response(svg, {
            headers: {
                "Content-Type": "image/svg+xml",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=31536000",
                "X-Content-Type-Options": "nosniff", // Prevents browser from treating it as text
            },
        });
    }
}
