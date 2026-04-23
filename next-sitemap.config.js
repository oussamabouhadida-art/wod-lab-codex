/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://wod-lab-codex.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.8,
};
