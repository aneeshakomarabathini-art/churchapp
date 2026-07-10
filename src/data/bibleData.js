// Bible book list with Telugu names, abbreviations, chapter counts
export const bibleBooks = {
  OT: [
    { id: 'Gen',   name: 'Genesis',          teluguName: 'ఆదికాండము',               abbr: 'Gen',   chapters: 50  },
    { id: 'Exod',  name: 'Exodus',           teluguName: 'నిర్గమకాండము',             abbr: 'Exod',  chapters: 40  },
    { id: 'Lev',   name: 'Leviticus',        teluguName: 'లేవీయకాండము',              abbr: 'Lev',   chapters: 27  },
    { id: 'Num',   name: 'Numbers',          teluguName: 'సంఖ్యాకాండము',             abbr: 'Num',   chapters: 36  },
    { id: 'Deut',  name: 'Deuteronomy',      teluguName: 'ద్వితీయోపదేశకాండము',       abbr: 'Deut',  chapters: 34  },
    { id: 'Josh',  name: 'Joshua',           teluguName: 'యెహోషువ',                  abbr: 'Josh',  chapters: 24  },
    { id: 'Judg',  name: 'Judges',           teluguName: 'న్యాయాధిపతులు',            abbr: 'Judg',  chapters: 21  },
    { id: 'Ruth',  name: 'Ruth',             teluguName: 'రూతు',                     abbr: 'Ruth',  chapters: 4   },
    { id: '1Sam',  name: '1 Samuel',         teluguName: '1 సమూయేలు',               abbr: '1Sam',  chapters: 31  },
    { id: '2Sam',  name: '2 Samuel',         teluguName: '2 సమూయేలు',               abbr: '2Sam',  chapters: 24  },
    { id: '1Kgs',  name: '1 Kings',          teluguName: '1 రాజులు',                 abbr: '1Kgs',  chapters: 22  },
    { id: '2Kgs',  name: '2 Kings',          teluguName: '2 రాజులు',                 abbr: '2Kgs',  chapters: 25  },
    { id: '1Chr',  name: '1 Chronicles',     teluguName: '1 దినవృత్తాంతములు',        abbr: '1Chr',  chapters: 29  },
    { id: '2Chr',  name: '2 Chronicles',     teluguName: '2 దినవృత్తాంతములు',        abbr: '2Chr',  chapters: 36  },
    { id: 'Ezra',  name: 'Ezra',             teluguName: 'ఎజ్రా',                    abbr: 'Ezra',  chapters: 10  },
    { id: 'Neh',   name: 'Nehemiah',         teluguName: 'నెహెమ్యా',                 abbr: 'Neh',   chapters: 13  },
    { id: 'Esth',  name: 'Esther',           teluguName: 'ఎస్తేరు',                  abbr: 'Esth',  chapters: 10  },
    { id: 'Job',   name: 'Job',              teluguName: 'యోబు',                     abbr: 'Job',   chapters: 42  },
    { id: 'Ps',    name: 'Psalms',           teluguName: 'కీర్తనల గ్రంథము',          abbr: 'Ps',    chapters: 150 },
    { id: 'Prov',  name: 'Proverbs',         teluguName: 'సామెతలు',                  abbr: 'Prov',  chapters: 31  },
    { id: 'Eccl',  name: 'Ecclesiastes',     teluguName: 'ప్రసంగి',                  abbr: 'Eccl',  chapters: 12  },
    { id: 'Song',  name: 'Song of Solomon',  teluguName: 'పరమగీతము',                 abbr: 'Song',  chapters: 8   },
    { id: 'Isa',   name: 'Isaiah',           teluguName: 'యెషయా',                    abbr: 'Isa',   chapters: 66  },
    { id: 'Jer',   name: 'Jeremiah',         teluguName: 'యిర్మియా',                 abbr: 'Jer',   chapters: 52  },
    { id: 'Lam',   name: 'Lamentations',     teluguName: 'విలాపవాక్యములు',           abbr: 'Lam',   chapters: 5   },
    { id: 'Ezek',  name: 'Ezekiel',          teluguName: 'యెహెజ్కేలు',               abbr: 'Ezek',  chapters: 48  },
    { id: 'Dan',   name: 'Daniel',           teluguName: 'దానియేలు',                 abbr: 'Dan',   chapters: 12  },
    { id: 'Hos',   name: 'Hosea',            teluguName: 'హోషేయ',                    abbr: 'Hos',   chapters: 14  },
    { id: 'Joel',  name: 'Joel',             teluguName: 'యోవేలు',                   abbr: 'Joel',  chapters: 3   },
    { id: 'Amos',  name: 'Amos',             teluguName: 'ఆమోసు',                    abbr: 'Amos',  chapters: 9   },
    { id: 'Obad',  name: 'Obadiah',          teluguName: 'ఓబద్యా',                   abbr: 'Obad',  chapters: 1   },
    { id: 'Jonah', name: 'Jonah',            teluguName: 'యోనా',                     abbr: 'Jonah', chapters: 4   },
    { id: 'Mic',   name: 'Micah',            teluguName: 'మీకా',                     abbr: 'Mic',   chapters: 7   },
    { id: 'Nah',   name: 'Nahum',            teluguName: 'నహూము',                    abbr: 'Nah',   chapters: 3   },
    { id: 'Hab',   name: 'Habakkuk',         teluguName: 'హబక్కూకు',                 abbr: 'Hab',   chapters: 3   },
    { id: 'Zeph',  name: 'Zephaniah',        teluguName: 'జెఫన్యా',                  abbr: 'Zeph',  chapters: 3   },
    { id: 'Hag',   name: 'Haggai',           teluguName: 'హగ్గయి',                   abbr: 'Hag',   chapters: 2   },
    { id: 'Zech',  name: 'Zechariah',        teluguName: 'జెకర్యా',                  abbr: 'Zech',  chapters: 14  },
    { id: 'Mal',   name: 'Malachi',          teluguName: 'మలాకీ',                    abbr: 'Mal',   chapters: 4   },
  ],
  NT: [
    { id: 'Matt',   name: 'Matthew',          teluguName: 'మత్తయి',                   abbr: 'Matt',   chapters: 28 },
    { id: 'Mark',   name: 'Mark',             teluguName: 'మార్కు',                   abbr: 'Mark',   chapters: 16 },
    { id: 'Luke',   name: 'Luke',             teluguName: 'లూకా',                     abbr: 'Luke',   chapters: 24 },
    { id: 'John',   name: 'John',             teluguName: 'యోహాను',                   abbr: 'John',   chapters: 21 },
    { id: 'Acts',   name: 'Acts',             teluguName: 'అపొస్తలుల కార్యములు',      abbr: 'Acts',   chapters: 28 },
    { id: 'Rom',    name: 'Romans',           teluguName: 'రోమీయులకు',                abbr: 'Rom',    chapters: 16 },
    { id: '1Cor',   name: '1 Corinthians',    teluguName: '1 కొరింథీయులకు',           abbr: '1Cor',   chapters: 16 },
    { id: '2Cor',   name: '2 Corinthians',    teluguName: '2 కొరింథీయులకు',           abbr: '2Cor',   chapters: 13 },
    { id: 'Gal',    name: 'Galatians',        teluguName: 'గలతీయులకు',                abbr: 'Gal',    chapters: 6  },
    { id: 'Eph',    name: 'Ephesians',        teluguName: 'ఎఫెసీయులకు',               abbr: 'Eph',    chapters: 6  },
    { id: 'Phil',   name: 'Philippians',      teluguName: 'ఫిలిప్పీయులకు',            abbr: 'Phil',   chapters: 4  },
    { id: 'Col',    name: 'Colossians',       teluguName: 'కొలొస్సయులకు',             abbr: 'Col',    chapters: 4  },
    { id: '1Thess', name: '1 Thessalonians',  teluguName: '1 థెస్సలొనీకయులకు',        abbr: '1Thes',  chapters: 5  },
    { id: '2Thess', name: '2 Thessalonians',  teluguName: '2 థెస్సలొనీకయులకు',        abbr: '2Thes',  chapters: 3  },
    { id: '1Tim',   name: '1 Timothy',        teluguName: '1 తిమోతి',                 abbr: '1Tim',   chapters: 6  },
    { id: '2Tim',   name: '2 Timothy',        teluguName: '2 తిమోతి',                 abbr: '2Tim',   chapters: 4  },
    { id: 'Titus',  name: 'Titus',            teluguName: 'తీతుకు',                   abbr: 'Titus',  chapters: 3  },
    { id: 'Phlm',   name: 'Philemon',         teluguName: 'ఫిలేమోనుకు',               abbr: 'Phlm',   chapters: 1  },
    { id: 'Heb',    name: 'Hebrews',          teluguName: 'హెబ్రీయులకు',              abbr: 'Heb',    chapters: 13 },
    { id: 'Jas',    name: 'James',            teluguName: 'యాకోబు',                   abbr: 'Jas',    chapters: 5  },
    { id: '1Pet',   name: '1 Peter',          teluguName: '1 పేతురు',                 abbr: '1Pet',   chapters: 5  },
    { id: '2Pet',   name: '2 Peter',          teluguName: '2 పేతురు',                 abbr: '2Pet',   chapters: 3  },
    { id: '1John',  name: '1 John',           teluguName: '1 యోహాను',                 abbr: '1Jn',    chapters: 5  },
    { id: '2John',  name: '2 John',           teluguName: '2 యోహాను',                 abbr: '2Jn',    chapters: 1  },
    { id: '3John',  name: '3 John',           teluguName: '3 యోహాను',                 abbr: '3Jn',    chapters: 1  },
    { id: 'Jude',   name: 'Jude',             teluguName: 'యూదా',                     abbr: 'Jude',   chapters: 1  },
    { id: 'Rev',    name: 'Revelation',       teluguName: 'ప్రకటన గ్రంథము',           abbr: 'Rev',    chapters: 22 },
  ],
};

export const VERSION_MAP = {
  KJV: 'kjv',
  NASB: 'nasb',
  ESV: 'esv',
};

// Fetch with timeout
async function fetchWithTimeout(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// Strip HTML
function stripHtml(html) {
  return (html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Book index for godlytalias JSON
const BOOK_INDEX = {
  'Genesis': 0,  'Exodus': 1,       'Leviticus': 2,   'Numbers': 3,      'Deuteronomy': 4,
  'Joshua': 5,   'Judges': 6,       'Ruth': 7,         '1 Samuel': 8,     '2 Samuel': 9,
  '1 Kings': 10, '2 Kings': 11,     '1 Chronicles': 12,'2 Chronicles': 13,'Ezra': 14,
  'Nehemiah': 15,'Esther': 16,      'Job': 17,         'Psalms': 18,      'Proverbs': 19,
  'Ecclesiastes': 20, 'Song of Solomon': 21, 'Isaiah': 22, 'Jeremiah': 23,'Lamentations': 24,
  'Ezekiel': 25, 'Daniel': 26,      'Hosea': 27,       'Joel': 28,        'Amos': 29,
  'Obadiah': 30, 'Jonah': 31,       'Micah': 32,       'Nahum': 33,       'Habakkuk': 34,
  'Zephaniah': 35,'Haggai': 36,     'Zechariah': 37,   'Malachi': 38,
  'Matthew': 39, 'Mark': 40,        'Luke': 41,        'John': 42,        'Acts': 43,
  'Romans': 44,  '1 Corinthians': 45,'2 Corinthians': 46,'Galatians': 47, 'Ephesians': 48,
  'Philippians': 49,'Colossians': 50,'1 Thessalonians': 51,'2 Thessalonians': 52,
  '1 Timothy': 53,'2 Timothy': 54,  'Titus': 55,       'Philemon': 56,    'Hebrews': 57,
  'James': 58,   '1 Peter': 59,     '2 Peter': 60,     '1 John': 61,      '2 John': 62,
  '3 John': 63,  'Jude': 64,        'Revelation': 65,
};

// Cache Telugu Bible
let _teluguCache = null;

async function getTeluguBible() {
  if (_teluguCache) return _teluguCache;
  const url = 'https://raw.githubusercontent.com/godlytalias/Bible-Database/master/Telugu/bible.json';
  const res = await fetchWithTimeout(url, 25000);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  _teluguCache = data;
  return data;
}

// Fetch Telugu chapter
export async function fetchTeluguChapter(bookName, chapter) {
  try {
    const bible = await getTeluguBible();
    const bookIdx = BOOK_INDEX[bookName];
    if (bookIdx === undefined) throw new Error(`Unknown book: ${bookName}`);

    const bookData    = bible.Book[bookIdx];
    if (!bookData)    throw new Error(`Book not found at index ${bookIdx} for: ${bookName}`);

    const chapterData = bookData.Chapter[chapter - 1];
    if (!chapterData) throw new Error(`Chapter ${chapter} not found in ${bookName}`);

    const verseArray  = chapterData.Verse;
    if (!Array.isArray(verseArray) || verseArray.length === 0) {
      throw new Error(`No verses in ${bookName} ${chapter}`);
    }

    return verseArray.map((v, i) => ({
      id:          `${bookName}-${chapter}-${i + 1}`,
      number:      i + 1,
      text:        stripHtml(String(v.Verse || '')),
      highlighted: false,
    }));

  } catch (err) {
    _teluguCache = null;
    console.error('[Telugu] fetch failed:', err.message);
    throw new Error('Telugu Bible unavailable. Please check your connection and try again.');
  }
}

// Fetch English chapter
export async function fetchEnglishChapter(bookName, chapter, version = 'kjv') {
  const encoded = encodeURIComponent(bookName);
  const url = `https://bible-api.com/${encoded}+${chapter}?translation=${version}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error('Failed to load chapter. Check your connection.');
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.verses.map((v) => ({
    id:          `${bookName}-${chapter}-${v.verse}`,
    number:      v.verse,
    text:        v.text.trim().replace(/\n/g, ' '),
    highlighted: false,
  }));
}
