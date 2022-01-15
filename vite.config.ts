import solidPlugin from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    solidPlugin({ ssr: true }),
    tsconfigPaths(),
  ],
  build: {
    minify: false,
    polyfillDynamicImport: false,
  },
});