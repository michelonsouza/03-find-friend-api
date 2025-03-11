import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src'],
  format: ['esm'], // Only generates `.js` files
  dts: false, // Generate TypeScript declaration files
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: 'build',
});
