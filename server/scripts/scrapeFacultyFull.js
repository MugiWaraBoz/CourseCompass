const { chromium } = require('playwright');
const fs = require('fs/promises');

const LIST_URL =
  'https://www.eastdelta.edu.bd/faculty-members/school-of-science-engineering-technology';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function clean(text = '') {
  return text.replace(/\s+/g, ' ').trim();
}

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i);
  return match ? match[0] : '';
}

function extractSection(fullText, headings) {
  const lines = fullText.split('\n').map(clean).filter(Boolean);

  const lowerHeadings = headings.map((h) => h.toLowerCase());

  let start = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (lowerHeadings.some((h) => line.includes(h))) {
      start = i + 1;
      break;
    }
  }

  if (start === -1) return '';

  const stopWords = [
    'education',
    'research',
    'publication',
    'experience',
    'teaching',
    'contact',
    'courses',
    'about',
    'biography',
  ];

  const result = [];

  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    const low = line.toLowerCase();

    if (stopWords.some((w) => low === w || low.startsWith(w + ' '))) {
      break;
    }

    result.push(line);
  }

  return clean(result.join(' '));
}

async function scrapeFacultyList(page) {
  await page.goto(LIST_URL, { waitUntil: 'networkidle' });

  const faculty = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a')];

    return links
      .map((a) => {
        const name = a.innerText.trim();
        const profileUrl = a.href;

        if (!name) return null;
        if (!profileUrl.includes('sites.google.com')) return null;

        let designation = '';

        let current = a.parentElement;
        for (let i = 0; i < 5 && current; i++) {
          const text = current.parentElement?.innerText || '';
          const lines = text
            .split('\n')
            .map((x) => x.trim())
            .filter(Boolean);

          const nameIndex = lines.findIndex((x) => x === name);
          if (nameIndex !== -1) {
            designation = lines[nameIndex + 1] || lines[nameIndex - 1] || '';
            break;
          }

          current = current.parentElement;
        }

        return {
          name,
          designation,
          department: 'SSET',
          profileUrl,
          avgRating: 0,
          reviewCount: 0,
        };
      })
      .filter(Boolean);
  });

  const unique = [];
  const seen = new Set();

  for (const f of faculty) {
    if (seen.has(f.profileUrl)) continue;
    seen.add(f.profileUrl);
    unique.push(f);
  }

  return unique;
}

async function scrapeFacultyProfile(context, faculty) {
  const page = await context.newPage();

  try {
    await page.goto(faculty.profileUrl, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    await sleep(1000);

    const data = await page.evaluate(() => {
      const bodyText = document.body.innerText || '';

      const image =
        document.querySelector("img[src*='googleusercontent']")?.src ||
        document.querySelector('img')?.src ||
        '';

      return {
        fullText: bodyText,
        image,
        title: document.title,
      };
    });

    const fullText = data.fullText;

    return {
      ...faculty,
      image: data.image,
      email: extractEmail(fullText),
      about:
        extractSection(fullText, ['about', 'biography', 'profile']) ||
        clean(fullText.split('\n').slice(0, 8).join(' ')),
      education: extractSection(fullText, [
        'education',
        'academic qualification',
      ]),
      researchInterests: extractSection(fullText, [
        'research interest',
        'research interests',
        'research area',
      ]),
      publications: extractSection(fullText, ['publication', 'publications']),
      rawText: clean(fullText),
    };
  } catch (err) {
    return {
      ...faculty,
      scrapeError: err.message,
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  console.log('Scraping faculty list...');
  const facultyList = await scrapeFacultyList(page);

  console.log(`Found ${facultyList.length} faculty with profile links.`);

  const finalData = [];

  for (let i = 0; i < facultyList.length; i++) {
    const faculty = facultyList[i];

    console.log(`[${i + 1}/${facultyList.length}] ${faculty.name}`);

    const fullProfile = await scrapeFacultyProfile(context, faculty);
    finalData.push(fullProfile);

    await sleep(1200);
  }

  await fs.mkdir('output', { recursive: true });

  await fs.writeFile(
    'output/faculty_full.json',
    JSON.stringify(finalData, null, 2),
  );

  await fs.writeFile(
    'output/faculty_seed.json',
    JSON.stringify(
      finalData.map((f) => ({
        name: f.name,
        shortCode: '',
        department: f.department || 'SSET',
        designation: f.designation || '',
        email: f.email || '',
        profileUrl: f.profileUrl || '',
        image: f.image || '',
        about: f.about || '',
        education: f.education || '',
        researchInterests: f.researchInterests || '',
        avgRating: 0,
        reviewCount: 0,
      })),
      null,
      2,
    ),
  );

  await browser.close();

  console.log('Done.');
  console.log('Saved:');
  console.log('output/faculty_full.json');
  console.log('output/faculty_seed.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
