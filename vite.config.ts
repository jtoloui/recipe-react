import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
	},
	plugins: [
		react(),
		svgr({
			exportAsDefault: false,
		}),
	],
	server: {
		port: 3000,
		https: {
			key: fs.readFileSync("./certs/localhost-key.pem"),
			cert: fs.readFileSync("./certs/localhost.pem"),
		},
	},
});
