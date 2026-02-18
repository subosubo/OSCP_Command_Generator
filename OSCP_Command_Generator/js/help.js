import { dom } from "./dom.js";
import { TAG_MAP, TAG_TO_ID } from "./config.js";
import { toast, escapeHtml } from "./ui.js";

export function populateHelp() {
  const popup = dom.helpPopup();
  const rows = Object.entries(TAG_MAP)
    .map(([tag, desc]) => {
      const t = escapeHtml(tag);
      const d = escapeHtml(desc);
      return `<tr data-tag="${t}"><td><code>${t}</code></td><td>${d}</td></tr>`;
    })
    .join("");

  popup.innerHTML = `
    <div class="help-head">
      <div class="help-title">Placeholders</div>
      <div class="help-sub">Click a row to focus its input.</div>
    </div>
    <table>
      <thead><tr><th>Tag</th><th>Description</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  popup.style.display = "none";
  popup.setAttribute("aria-hidden", "true");

  popup.addEventListener("click", (e) => {
    const tr = e.target.closest("tr");
    if (!tr) return toggleHelp();
    const tag = tr.getAttribute("data-tag");
    const id = TAG_TO_ID[tag];
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        el.focus();
        el.scrollIntoView({ block: "center" });
        toast(`Focused: ${TAG_MAP[tag] || tag}`);
      }
    }
    toggleHelp();
  });
}

export function toggleHelp() {
  const popup = dom.helpPopup();
  const btn = dom.helpBtn();
  const open = popup.style.display === "block";
  popup.style.display = open ? "none" : "block";
  popup.setAttribute("aria-hidden", String(open));
  btn.setAttribute("aria-expanded", String(!open));
}
