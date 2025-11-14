/**
 * Node.js ESM Loader for CSS imports
 * 
 * This loader allows Node.js to handle CSS imports during SSR builds.
 * CSS imports are stubbed out (return empty exports) since they'll be
 * handled by Vite/bundler on the client side.
 * 
 * Usage: node --import ./css-loader.mjs
 */

export async function load(url, context, nextLoad) {
	// Handle .css files by returning an empty module
	if (url.endsWith('.css')) {
		return {
			format: 'module',
			source: 'export default {};',
			shortCircuit: true,
		};
	}

	// Let default loaders handle everything else
	return nextLoad(url, context);
}
