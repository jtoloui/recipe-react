import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		https: {
			key: fs.readFileSync("./certs/localhost-key.pem"),
			cert: fs.readFileSync("./certs/localhost.pem"),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "./src/styles/variables.scss";`,
			},
		},
	},
});
