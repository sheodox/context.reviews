import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	server: {
		port: 3000,
		host: 'localhost',
	},
	build: {
		manifest: true,
		outDir: './public-dist',
		rollupOptions: {
			input: {
				main: '/src/static/main.ts',
				'landing-main': '/src/static/landing-app/landing-main.ts',
			},
		},
	},
});
