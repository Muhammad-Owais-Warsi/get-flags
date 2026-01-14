import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";

export class DocsPage extends OpenAPIRoute {
    schema = {
        tags: ["Documentation"],
        summary: "API Documentation and Playground",
    };

    async handle(c: AppContext) {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flag API - Docs</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=Oxanium:wght@400;500;600&family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --font-sans: "Source Code Pro", monospace;
            --font-serif: "Lora", serif;
            --font-mono: "Oxanium", sans-serif;
            --bg-body: #ffffff;
            --bg-card: #f9fafb;
            --bg-code: #f3f4f6;
            --text-main: #18181b;
            --text-muted: #71717a;
            --border: #e4e4e7;
            --accent: #18181b;
        }

        [data-theme="dark"] {
            --bg-body: #09090b;
            --bg-card: #18181b;
            --bg-code: #27272a;
            --text-main: #fafafa;
            --text-muted: #a1a1aa;
            --border: #27272a;
            --accent: #fafafa;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: var(--font-sans);
            background-color: var(--bg-body);
            color: var(--text-main);
            line-height: 1.6;
            padding: 1rem;
        }

        .container { max-width: 620px; margin: 4rem auto; }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border);
        }

        h1 {
            font-size: 1.25rem;
            font-weight: 600;
            letter-spacing: -0.02em;
        }

        section {
            margin-bottom: 2.5rem;
        }

        h2 {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-muted);
            margin-bottom: 0.75rem;
            font-weight: 500;
        }

        .endpoint-container {
            display: flex;
            align-items: center;
            background: var(--bg-code);
            padding: 0.625rem 0.875rem;
            gap: 0.75rem;
            border: 1px solid var(--border);
        }

        .method-badge {
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            font-family: var(--font-sans);
            letter-spacing: 0.05em;
        }

        .endpoint-bar {
            color: var(--text-main);
            font-family: var(--font-sans);
            font-size: 0.8125rem;
            flex-grow: 1;
            font-weight: 400;
        }

        .playground-input {
            width: 100%;
            padding: 0.625rem 0.875rem;
            border: 1px solid var(--border);
            background: var(--bg-card);
            color: var(--text-main);
            font-size: 0.9375rem;
            margin-bottom: 0.75rem;
            font-family: inherit;
        }
        .playground-input:focus {
            outline: none;
            border-color: var(--accent);
        }

        .btn-primary {
            width: 100%;
            background: var(--accent);
            color: var(--bg-body);
            border: none;
            padding: 0.625rem;
            font-weight: 500;
            font-size: 0.875rem;
            cursor: pointer;
            font-family: inherit;
        }
        .btn-primary:hover {
            opacity: 0.9;
        }

        .result-area {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
            display: none;
            text-align: center;
        }
        .result-area.show { display: block; }

        .preview-window {
            background-color: #ffffff;
            background-image: linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%);
            background-size: 16px 16px;
            background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
            border: 1px solid var(--border);
            padding: 2.5rem;
            margin-bottom: 1rem;
            display: inline-block;
        }
        .preview-window img {
            max-width: 140px;
            height: auto;
            display: block;
        }

        .btn-copy-svg {
            width: 100%;
            background: var(--bg-card);
            border: 1px solid var(--border);
            color: var(--text-main);
            padding: 0.625rem;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            font-family: inherit;
        }
        .btn-copy-svg:hover {
            background: var(--bg-code);
        }

        .btn-small-copy {
            background: transparent;
            color: var(--text-muted);
            border: 1px solid var(--border);
            padding: 0.375rem 0.75rem;
            font-size: 0.6875rem;
            cursor: pointer;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-family: inherit;
        }
        .btn-small-copy:hover {
            color: var(--text-main);
            border-color: var(--accent);
        }

        #msg {
            margin-top: 1rem;
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--text-muted);
            min-height: 1.2rem;
        }

        footer {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
            text-align: center;
            color: var(--text-muted);
            font-size: 0.8125rem;
        }

        footer a {
            color: var(--text-muted);
            font-weight:bold;
            text-decoration: underline;
        }

        footer a:hover {
            color: var(--text-main);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Flag API</h1>
            <button class="btn-small-copy" onclick="toggleTheme()">Theme</button>
        </header>

        <section>
            <h2>Endpoint</h2>
            <div class="endpoint-container">
                <span class="method-badge">GET</span>
                <div class="endpoint-bar">/api/flags/:identifier</div>
                <button class="btn-small-copy" onclick="copyText('/api/flags/:identifier', this)">Copy</button>
            </div>
        </section>

        <section>
            <h2>Playground</h2>
            <input type="text" id="idInput" class="playground-input" placeholder="Enter country code (us, jp)" value="us">
            <button class="btn-primary" onclick="generate()">Preview Flag</button>

            <div id="result" class="result-area">
                <div class="preview-window">
                    <img id="resImg" alt="SVG Preview">
                </div>
                <button class="btn-copy-svg" id="copyBtn" onclick="copySVG(this)">Copy SVG</button>
                <p id="msg"></p>
            </div>
        </section>

        <footer>
            <p>Powered by <a href="https://workers.cloudflare.com" target="_blank">Cloudflare Workers</a> & <a href="https://flagcdn.com" target="_blank">FlagCDN</a></p>
            <p style="margin-top: 0.5rem;"><a href="https://github.com/Muhammad-Owais-Warsi/get-flags" target="_blank">GitHub</a></p>
        </footer>
    </div>

    <script>
        let lastUrl = "";

        function toggleTheme() {
            const h = document.documentElement;
            h.setAttribute('data-theme', h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        }

        async function copyText(text, btn) {
            await navigator.clipboard.writeText(text);
            const original = btn.textContent;
            btn.textContent = "Copied";
            setTimeout(() => {
                btn.textContent = original;
            }, 1500);
        }

        function generate() {
            const val = document.getElementById('idInput').value.trim().toLowerCase();
            if(!val) return;
            lastUrl = window.location.origin + "/api/flags/" + val;
            document.getElementById('resImg').src = lastUrl;
            document.getElementById('result').classList.add('show');
            document.getElementById('msg').textContent = "";
        }

        async function copySVG(btn) {
            const m = document.getElementById('msg');
            const originalText = btn.textContent;
            try {
                const r = await fetch(lastUrl);
                const text = await r.text();
                await navigator.clipboard.writeText(text);
                btn.textContent = "Copied to Clipboard";
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 1500);
            } catch (e) {
                m.textContent = "Failed to fetch SVG source.";
            }
        }
    </script>
</body>
</html>
		`;

        return new Response(html, { headers: { "Content-Type": "text/html" } });
    }
}
