import { STORAGE, APP_VERSION } from "./config.js";
import { app } from "./state.js";
import { applyUI } from "./ui_state.js";

function safeJsonParse(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

// ===== Favorites =====
export function getFavorites() {
  return safeJsonParse(localStorage.getItem(STORAGE.favorites) || "[]", []);
}

export function setFavorites(arr) {
  localStorage.setItem(STORAGE.favorites, JSON.stringify(arr));
}

export function favKey(cat, title, cmd) {
  const sig = String(cmd || "").slice(0, 60);
  return `${cat}||${title}||${sig}`;
}

export function isFav(key) {
  return getFavorites().includes(key);
}

export function toggleFav(key) {
  const favs = getFavorites();
  const idx = favs.indexOf(key);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.unshift(key);
  setFavorites(favs.slice(0, 250));
  return idx < 0;
}

// ===== UI state =====
export function loadUI() {
  const saved = safeJsonParse(localStorage.getItem(STORAGE.ui) || "{}", {});
  Object.assign(app.state, saved);
  applyUI();
}

export function saveUI() {
  localStorage.setItem(STORAGE.ui, JSON.stringify(app.state));
}

export function clearAllFilters({ save = true } = {}) {
  app.state.credentialOnly = false;
  app.state.nonCredentialOnly = false;
  app.state.priorityOnly = false;
  app.state.favoritesOnly = false;
  if (save) saveUI();
  applyUI();
}

// ===== Non-sensitive inputs =====
export function saveNonSensitiveInputs() {
  const ids = [
    "target","target6","targetPort","kali","kali6","kaliPort",
    "user","domain","dcIp","filename1","filename2","wordlist1","wordlist2"
  ];
  const payload = {};
  for (const id of ids) payload[id] = document.getElementById(id)?.value || "";
  localStorage.setItem(STORAGE.inputs, JSON.stringify(payload));
}

export function loadNonSensitiveInputs() {
  const payload = safeJsonParse(localStorage.getItem(STORAGE.inputs) || "{}", {});
  for (const [id, val] of Object.entries(payload)) {
    const el = document.getElementById(id);
    if (el && typeof val === "string") el.value = val;
  }
}

export function enableRememberToggleIfSaved() {
  if (localStorage.getItem(STORAGE.inputs)) {
    const t = document.getElementById("toggleRemember");
    if (t) t.checked = true;
    loadNonSensitiveInputs();
  }
}

// ===== Migration =====
export function migrateStorage() {
  try {
    const prev = localStorage.getItem(STORAGE.version) || "";
    if (prev === APP_VERSION) return;

    // Clear any old smartFetch caches from earlier builds
    const toDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith("cache_") || k.startsWith("etag_")) toDelete.push(k);
    }
    toDelete.forEach((k) => localStorage.removeItem(k));

    localStorage.setItem(STORAGE.version, APP_VERSION);
  } catch {
    // ignore
  }
}
