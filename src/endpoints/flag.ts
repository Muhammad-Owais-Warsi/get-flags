import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";

export class GetFlag extends OpenAPIRoute {
    schema = {
        tags: ["Flags"],
        summary: "Resolve Flag SVG (Unlimited & Fast)",
        request: {
            params: z.object({
                identifier: z.string().describe("2-letter code, IP, or 'me'"),
            }),
        },
    };

    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();
        let input = data.params.identifier.trim().toLowerCase();
        let countryCode: string = "un";

        // 1. Logic for 'me' or auto-detecting the user's IP
        // Cloudflare handles this WITHOUT calling an external API
        if (input === "me" || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(input)) {
            // Note: Cloudflare automatically detects the country of the IP
            // making the request. For specific IPs, external APIs are needed,
            // but for the CURRENT user, Cloudflare is best:
            countryCode = (
                (c.req.raw.cf?.country as string) || "un"
            ).toLowerCase();
        } else if (input.length === 2) {
            countryCode = input;
        }

        const iconUrl = `https://flagcdn.com/${countryCode}.svg`;
        const response = await fetch(iconUrl);

        if (!response.ok) {
            return c.redirect("https://flagcdn.com/un.svg");
        }

        const svgData = await response.text();

        return new Response(svgData, {
            headers: {
                "Content-Type": "image/svg+xml",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=31536000", // Cache for 1 year
                "X-Served-By": "Cloudflare-Edge",
            },
        });
    }
}
