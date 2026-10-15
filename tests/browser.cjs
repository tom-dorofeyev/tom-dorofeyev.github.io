const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright-core');

const siteDirectory = path.resolve(process.env.SITE_DIR || '_site');
const screenshotDirectory = process.env.SCREENSHOT_DIR;
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const featuredPath = '/2026/05/15/timeless-principles-1-dependency-inversion-in-ai-agents.html';
const olderPath = '/2025/09/07/the-age-of-professionalism.html';
const pages = ['/', featuredPath, olderPath];
const viewports = [1440, 768, 390, 320];

function relativeLuminance(color) {
  const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number);
  const linear = channels.map(channel => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(foreground, background) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((left, right) => right - left);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function serveSite(request, response) {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (!pathname.startsWith('/preview/')) {
    response.writeHead(404).end();
    return;
  }
  const requested = pathname.slice('/preview/'.length) || 'index.html';
  const file = path.resolve(siteDirectory, requested);
  if (!file.startsWith(siteDirectory + path.sep)) {
    response.writeHead(403).end();
    return;
  }
  const types = { '.css': 'text/css', '.jpg': 'image/jpeg', '.html': 'text/html' };
  response.setHeader('Content-Type', types[path.extname(file)] || 'text/plain');
  fs.createReadStream(file).on('error', () => response.writeHead(404).end()).pipe(response);
}

async function getVisualState(page) {
  return page.evaluate(() => {
    const style = selector => getComputedStyle(document.querySelector(selector));
    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      background: style('body').backgroundColor,
      text: style('main').color,
      header: style('.site-header').backgroundColor,
      footer: style('.site-footer').backgroundColor,
      footerText: style('.footer-heading').color,
    };
  });
}

async function assertReadableLayout(page) {
  const state = await getVisualState(page);
  assert.ok(state.scrollWidth <= state.viewportWidth, `Horizontal overflow: ${JSON.stringify(state)}`);
  assert.ok(relativeLuminance(state.background) < 0.1, 'Dark background');
  assert.equal(state.header, state.background, 'Dark header');
  assert.equal(state.footer, state.background, 'Dark footer');
  assert.ok(contrast(state.text, state.background) >= 7, 'Readable main text');
  assert.ok(contrast(state.footerText, state.footer) >= 4.5, 'Readable footer');
}

async function assertImagesLoaded(page) {
  const imagesLoaded = await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
  assert.ok(imagesLoaded, 'Images load');
}

async function assertFeaturedCardAppearance(page, width) {
  const card = page.locator('.featured-card');
  const styles = await card.evaluate(element => ({
    columns: getComputedStyle(element).gridTemplateColumns,
    imageFit: getComputedStyle(element.querySelector('img')).objectFit,
    accent: getComputedStyle(element.querySelector('.text-link')).color,
    background: getComputedStyle(document.body).backgroundColor,
  }));
  assert.ok(contrast(styles.accent, styles.background) >= 4.5, 'Readable accent link');
  assert.equal(styles.imageFit, 'contain', 'Full featured illustration visible');
  if (width <= 700) assert.equal(styles.columns.split(' ').length, 1, 'Mobile card stacks');
}

async function checkFeaturedLink(page, origin) {
  await page.locator('.featured-card__content h3 a').click();
  assert.ok(page.url().endsWith(featuredPath), 'Featured card opens article');
  await page.goto(origin + '/');
}

async function checkArchiveLink(page, origin) {
  await page.locator('.archive-list a').click();
  assert.ok(page.url().endsWith(olderPath), 'Archive opens older article');
  await page.goto(origin + '/');
}

async function saveScreenshot(page, pathname, width) {
  if (!screenshotDirectory || ![1440, 390].includes(width)) return;
  const name = pathname === '/' ? 'home' : pathname === featuredPath ? 'featured' : 'older';
  await page.screenshot({ path: path.join(screenshotDirectory, `site-${name}-${width}.png`), fullPage: true });
}

async function openMobileMenu(page) {
  await page.locator('.site-nav label[for="nav-trigger"]').click();
  assert.ok(await page.locator('.site-nav .page-link').isVisible(), 'Mobile menu opens');
  const menuColor = await page.locator('.site-nav').evaluate(nav => getComputedStyle(nav).backgroundColor);
  assert.ok(relativeLuminance(menuColor) < 0.1, 'Mobile menu stays dark');
}

async function checkNavigation(page, width) {
  if (width <= 600) await openMobileMenu(page);
  await page.locator('.site-nav .page-link').click();
  assert.equal(new URL(page.url()).pathname, '/preview/', 'Navigation returns home');
}

async function checkPage({ browser, origin, pathname, width }) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  try {
    await page.goto(origin + pathname, { waitUntil: 'networkidle' });
    await assertReadableLayout(page);
    await assertImagesLoaded(page);
    if (pathname === '/') {
      await assertFeaturedCardAppearance(page, width);
      await checkFeaturedLink(page, origin);
      await checkArchiveLink(page, origin);
    }
    await saveScreenshot(page, pathname, width);
    await checkNavigation(page, width);
    console.log(`PASS ${width}px ${pathname}`);
  } finally {
    await page.close();
  }
}

async function run() {
  const server = http.createServer(serveSite);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const origin = `http://127.0.0.1:${server.address().port}/preview`;
    const browser = await chromium.launch({ executablePath: chromePath, headless: true });
    try {
      for (const width of viewports) {
        for (const pathname of pages) await checkPage({ browser, origin, pathname, width });
      }
    } finally {
      await browser.close();
    }
  } finally {
    server.close();
  }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
