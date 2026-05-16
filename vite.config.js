import { defineConfig } from 'vite'

export default defineConfig({
  // './' makes all asset paths relative so the build works on any subpath
  // (e.g. https://username.github.io/emblem-gen/)
  base: './',
  assetsInclude: ['**/*.woff', '**/*.woff2'],
})
