import adapter from 'svelte-adapter-bun';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		experimental: {
			remoteFunctions: true
		},
		adapter: adapter()
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
