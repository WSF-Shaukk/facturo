/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://facturo.africa",
  generateRobotsTxt: true,
  exclude: ["/dashboard/*", "/api/*", "/auth/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/dashboard/", "/api/", "/auth/"],
      },
    ],
  },
};
