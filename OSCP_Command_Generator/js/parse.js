import { dom } from "./dom.js";
import { smartFetch, fetchJson } from "./fetch.js";
import { app } from "./state.js";
import { setStatus } from "./ui.js";
import { DELIM_STEPS } from "./config.js";

/**
 * File format (one command per line):
 *   [^]Title:Command text...
 *
 * - '^' at start => priority line
 * - Title is everything before the FIRST ':'
 * - Command is everything after the FIRST ':'
 * - Lines without ':' are accepted (Title="Command", cmd=line)
 *
 * Rendering requirement (latest):
 * - Combine same Title into ONE command card
 * - Each line becomes a step inside that card (numbered + copy per step)
 * - Priority: cards that contain any priority line appear first (order preserved)
 */
export function parseCommandsText(text) {
  const rawLines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.replace(/\r/g, ""))
    .filter((l) => l.trim() !== "");

  // 1) Parse lines (no merging here)
  const lines = [];
  for (let raw of rawLines) {
    let line = raw.trim();
    let priority = false;

    if (line.startsWith("^")) {
      priority = true;
      line = line.slice(1).trim();
    }

    const idx = line.indexOf(":");
    const title = idx === -1 ? "Command" : line.slice(0, idx).trim();
    const cmd = idx === -1 ? line : line.slice(idx + 1).trim();

    lines.push({ title, cmd, priority });
  }

  // 2) Group by title (preserve first-seen order)
  const groups = new Map(); // title -> { title, cmds[], priority }
  for (const item of lines) {
    const key = item.title;
    if (!groups.has(key)) {
      groups.set(key, { title: item.title, cmds: [], priority: false });
    }
    const g = groups.get(key);
    g.cmds.push(item.cmd);
    g.priority = g.priority || item.priority;
  }

  const grouped = Array.from(groups.values()).map((g) => ({
    title: g.title,
    // Join into multi-step string so renderer naturally shows step UI
    cmd: g.cmds.join(DELIM_STEPS),
    priority: g.priority,
  }));

  // 3) Priority cards first; preserve order within each bucket
  const pri = grouped.filter((e) => e.priority);
  const norm = grouped.filter((e) => !e.priority);
  return [...pri, ...norm];
}

export async function loadCommands(cat) {
  const text = await smartFetch(`data/${cat}.txt`);
  return parseCommandsText(text);
}

function uniqueSorted(arr) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

async function tryLoadFromManifest() {
  try {
    const list = await fetchJson("data/manifest.json");
    const cats = Array.isArray(list) ? list.filter(Boolean) : [];
    return uniqueSorted(cats.map(String));
  } catch {
    return [];
  }
}

// Optional fallback if server exposes directory listing
async function tryLoadFromDirectoryListing() {
  try {
    const html = await smartFetch("data/");
    const files = [...html.matchAll(/href=['"]([^'"]+\.txt)['"]/gi)].map((m) => m[1]);
    const names = files
      .map((f) => f.replace(/^.*\//, "").replace(/\.txt$/i, ""))
      .filter(Boolean);
    return uniqueSorted(names);
  } catch {
    return [];
  }
}

function setDropdown(select, names, preserveValue) {
  select.innerHTML = '<option value="">Find category</option>';
  for (const name of names) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }
  if (preserveValue) select.value = preserveValue;
}

export async function loadCategories(preserveValue = "") {
  const select = dom.category();

  let names = await tryLoadFromManifest();
  if (!names.length) names = await tryLoadFromDirectoryListing();

  app.categories = names;
  setDropdown(select, names, preserveValue);

  if (!names.length) {
    setStatus("No categories (run create.bat to generate data/manifest.json)");
    dom.commandInfo()?.replaceChildren(
      document.createTextNode("No categories found. Run create.bat to generate data/manifest.json."),
    );
  } else {
    setStatus("Ready");
  }
}
