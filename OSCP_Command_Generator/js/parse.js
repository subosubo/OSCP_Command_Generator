import { dom } from "./dom.js";
import { smartFetch, fetchJson } from "./fetch.js";
import { app } from "./state.js";
import { setStatus } from "./ui.js";
import { parseCommandsText } from "./parse_core.js";

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
export { parseCommandsText };

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
    const files = [...html.matchAll(/href=['"]([^'"]+\.txt)['"]/gi)].map(
      (m) => m[1],
    );
    const names = files
      .map((f) => f.replace(/^.*\//, "").replace(/\.txt$/i, ""))
      .filter(Boolean);
    return uniqueSorted(names);
  } catch {
    return [];
  }
}

function setDropdown(select, names, preserveValue) {
  select.innerHTML = '<option value="">Select category</option>';
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
    dom
      .commandInfo()
      ?.replaceChildren(
        document.createTextNode(
          "No categories found. Run create.bat to generate data/manifest.json.",
        ),
      );
  } else {
    setStatus("Ready");
  }
}
