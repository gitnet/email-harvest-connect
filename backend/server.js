// scrape-google.js
require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(express.json());

app.get('/api/scrape-google', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter ?q=' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    // Extract result URLs
    const resultLinks = await page.$$eval('a', (anchors) =>
      anchors
        .map((a) => a.href)
        .filter((href) => href.startsWith('http') && !href.includes('google.com'))
    );

    const emailsSet = new Set();

    for (const link of resultLinks.slice(0, 5)) {
      try {
        const subPage = await browser.newPage();
        await subPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 15000 });

        const content = await subPage.evaluate(() => document.body.innerText);
        const emails = content.match(
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
        );

        if (emails && emails.length > 0) {
          emails.forEach((email) => emailsSet.add(email));
        }

        await subPage.close();
      } catch (err) {
        console.warn(`Could not load ${link}: ${err.message}`);
      }
    }

    await browser.close();

    const foundEmails = Array.from(emailsSet);

    return res.json({
      query,
      totalFound: foundEmails.length,
      emails: foundEmails,
      contents: foundEmails.join('\n'),
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({ error: 'Internal scraping error' });
  }
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
