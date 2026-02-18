import { dom } from "./dom.js";
import { app } from "./state.js";
import { smartFetch } from "./fetch.js";

let lookupTimer = null;
const cache = new Map(); // cat -> text (lowercase)

function normalize(s) {
  return String(s || "").toLowerCase();
}

export function clearCommandInfo() {
  const el = dom.commandInfo?.();
  if (el) el.textContent = "";
}

// Lazy-load category text and cache it.
async function getCategoryText(cat) {
  if (cache.has(cat)) return cache.get(cat);
  const txt = await smartFetch(`data/${cat}.txt`);
  const low = normalize(txt);
  cache.set(cat, low);
  return low;
}

async function findCategoriesContaining(term) {
  const t = normalize(term).trim();
  if (!t) return [];
  // To keep it fast, require a small minimum
  if (t.length < 3) return [];

  const hits = [];
  for (const cat of app.categories) {
    try {
      const body = await getCategoryText(cat);
      if (body.includes(t)) hits.push(cat);
    } catch {
      // ignore per-category fetch errors
    }
  }
  return hits;
}

export function scheduleCommandLookup() {
  clearTimeout(lookupTimer);
  lookupTimer = setTimeout(async () => {
    const box = dom.search();
    const info = dom.commandInfo?.();
    if (!info || !box) return;

    const term = box.value.trim();
    if (!term) {
      info.textContent = "";
      return;
    }

    const hits = await findCategoriesContaining(term);
    if (!hits.length) {
      info.textContent = "No category match.";
      return;
    }
    info.textContent = `Found in: ${hits.join(", ")}`;
  }, 220);
}
