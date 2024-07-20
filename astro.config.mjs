import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, squooshImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import customToc from "astro-custom-toc";

import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import icon from "astro-icon";
import astrowind from "./vendor/integration";
import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
} from "./src/utils/frontmatter.mjs";
import sentry from "@sentry/astro";

import { customTemplate } from './src/utils/customTocTemplate.ts'; // Import your custom template function


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hasExternalScripts = false;
const whenExternalScripts = (items = []) =>
  hasExternalScripts
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [
    sentry({
      dsn: "https://3502dc747e79fa21814b87fdbc9bad28@o4507275942952960.ingest.us.sentry.io/4507275945443328",
      sourceMapsUploadOptions: {
        project: "docs-to-markdown-pro",
        authToken: "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",
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) =>
        !page.startsWith("https://www.docstomarkdown.pro/tag/") &&
        !page.startsWith("https://www.docstomarkdown.pro/blog/"),
    }),
    customToc({
        template: customTemplate,  // Use your custom template function here
        maxDepth: 3,               // Optional: Set maximum depth of the TOC
        ordered: false             // Optional: Set whether the TOC should be ordered
    }),
    mdx(),
    icon({
      include: {
        tabler: ["*"],
        "flat-color-icons": [
          "template",
          "gallery",
          "approval",
          "document",
          "advertising",
          "currency-exchange",
          "voice-presentation",
          "business-contact",
          "database",
        ],
      },
    }),
    ...whenExternalScripts(() =>
      partytown({
        config: {
          forward: ["dataLayer.push"],
        },
      })
    ),
    /*compress({
    CSS: true,
    HTML: {
      'html-minifier-terser': {
        removeAttributeQuotes: false,
      },
    },
    Image: false,
    JavaScript: true,
    SVG: false,
    Logger: 1,
  }),*/

    astrowind({
      config: "./src/config.yaml",
    }),
  ],
  image: {
    service: squooshImageService(),
    domains: ["cdn.pixabay.com"],
  },
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
});
