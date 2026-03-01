import { TAG_MAP } from "./config.js";

export function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

export function isCredentialedTemplate(template) {
  const tags = extractTags(template);
  return tags.includes("<user>") && tags.includes("<password>");
}
