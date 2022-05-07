import { GetServerSideProps } from "next";
import * as fs from "fs";

const Sitemap = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const BASE_URL = "https://www.fega.ml";

  const staticPaths = fs
    .readdirSync("pages")
    .filter((staticPage) => {
      return ![
        "api",
        "product",
        "_app.tsx",
        "_document.js",
        "404.js",
        "sitemap.xml.js",
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${BASE_URL}/${staticPagePath}`;
    });

  const dynamicPaths = [`${BASE_URL}/post/[id]`];

  const allPaths = [...staticPaths, ...dynamicPaths];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map((url) => {
          return `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  context.res.setHeader("Content-Type", "text/xml");
  context.res.write(sitemap);
  context.res.end();

  return {
    props: {},
  };
};

export default Sitemap;
