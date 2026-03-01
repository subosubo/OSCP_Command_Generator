import { dom } from "./dom.js";
import { escapeHtml } from "./util.js";

export function setStatus(text) {
  const el = dom.status();
  if (el) el.textContent = text;
}

export function toast(msg) {
  const el = dom.toast();
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 1400);
}

export { escapeHtml };
