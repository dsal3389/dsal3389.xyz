import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://dsal3389.xyz',
  output: 'static',
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
