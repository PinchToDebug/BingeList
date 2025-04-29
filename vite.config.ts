import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
	server: {
		host: "0.0.0.0",
		port: 5000,
	},
	plugins: [sveltekit()],
});
