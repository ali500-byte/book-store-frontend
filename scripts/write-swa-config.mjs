import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const apiUrl = process.env.VITE_API_URL?.replace(/\/$/, "");
const isLocal =
  !apiUrl || apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1");

if (isLocal) {
  console.log("Skipping staticwebapp.config.json (local API URL)");
  process.exit(0);
}

const config = {
  routes: [
    {
      route: "/api/*",
      rewrite: `${apiUrl}/*`,
    },
  ],
  navigationFallback: {
    rewrite: "/index.html",
    exclude: ["/api/*", "*.{css,scss,js,png,gif,ico,jpg,svg,webp}"],
  },
};

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

writeFileSync(
  join(publicDir, "staticwebapp.config.json"),
  JSON.stringify(config, null, 2)
);
console.log(`Wrote staticwebapp.config.json → ${apiUrl}/*`);
