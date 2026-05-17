import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://dsal3389.xyz",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "gruvbox-light-medium",
        dark: "gruvbox-dark-medium"
      },
      wrap: true
    }
  }
});
