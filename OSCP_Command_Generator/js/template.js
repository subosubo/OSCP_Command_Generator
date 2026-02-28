import { TAG_TO_ID } from "./config.js";
import { dom } from "./dom.js";
import { extractTags, escapeRegex, isCredentialedTemplate } from "./template_core.js";

// Re-export pure helpers so app modules can continue importing from ./template.js
export { extractTags, escapeRegex, isCredentialedTemplate };

// DOM-backed substitution
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
