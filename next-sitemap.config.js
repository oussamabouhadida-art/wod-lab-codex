/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.crossdatafit.space',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.8,
  exclude: ["/admin", "/en/admin", "/fr/admin", "/es/admin", "/api/*"],
};
