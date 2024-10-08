import adapterAuto from '@sveltejs/adapter-auto'
import adapterNode from '@sveltejs/adapter-node'
import adapterStatic from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { loadEnv } from 'vite'

/** @type {{ BUILD_ADAPTER: 'auto' | 'node' | 'static', BUILD_BASE: string | undefined, BUILD_IPFS: 'false' | 'true' }} */
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'BUILD')

/** @returns {import('@sveltejs/kit').Adapter} */
function adapter() {
	if (env.BUILD_IPFS === 'true') return adapterStatic({ fallback: 'ipfs-404.html' })
	else if (env.BUILD_ADAPTER === 'node') return adapterNode()
	else if (env.BUILD_ADAPTER === 'static' || process.env.GITHUB_ACTIONS === 'true')
		return adapterStatic({ fallback: '404.html' })

	return adapterAuto()
}

// Function to process the base path
function processBasePath(basePath) {
	if (!basePath) return ''
	basePath = basePath.trim()
	if (basePath === '/') return ''
	return basePath.startsWith('/') ? basePath : `/${basePath}`
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter(),
		paths: { base: processBasePath(env.BUILD_BASE) },
	},
}

export default config
