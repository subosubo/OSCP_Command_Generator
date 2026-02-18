import { TAG_MAP, TAG_TO_ID } from "./config.js";
import { dom } from "./dom.js";

export function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const TAG_REGEX = new RegExp(
  Object.keys(TAG_MAP).map(escapeRegex).join("|"),
  "g",
);

export function extractTags(template) {
  const tags = new Set();
  const matches = String(template || "").match(TAG_REGEX) || [];
  for (const t of matches) tags.add(t);
  return Array.from(tags);
}

export function applyVars(template) {
  let out = String(template || "");
  for (const [tag, id] of Object.entries(TAG_TO_ID)) {
    const val = dom.$(id)?.value || "";
    out = out.split(tag).join(val || tag);
  }
  return out;
}

export function missingTags(template) {
  const miss = [];
  for (const t of extractTags(template)) {
    const id = TAG_TO_ID[t];
    const el = id ? dom.$(id) : null;
    if (el && !String(el.value || "").trim()) miss.push(t);
  }
  return miss;
}

export function isCredentialedTemplate(template) {
  const tags = extractTags(template);
  return tags.includes("<user>") && tags.includes("<password>");
}
