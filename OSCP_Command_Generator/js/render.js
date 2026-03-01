import { dom } from "./dom.js";
import { app } from "./state.js";
import { TAG_MAP, DELIM_STEPS } from "./config.js";
import { applyVars, missingTags, isCredentialedTemplate } from "./template.js";
import { highlightTitle, highlightCommand } from "./highlight.js";
import { toolBadgeFromCmd } from "./tooling.js";
import { favKey, isFav, toggleFav } from "./storage.js";
import { copyToClipboard } from "./clipboard.js";
import { toast, escapeHtml, setStatus } from "./ui.js";
import { loadCommands } from "./parse.js";
import { scheduleFilter } from "./filters.js";

function shouldBlockCopy(missing) {
  return dom.toggleBlockCopy()?.checked && missing.length > 0;
}

function splitSteps(cmd) {
  const s = String(cmd || "");
  if (!s.includes(DELIM_STEPS)) return [s];
  return s.split(DELIM_STEPS).map((x) => x.trim()).filter(Boolean);
}

function buildBadges(cat, entry, miss, tool) {
  const badges = [];
  if (tool) badges.push(`<span class="badge tool">${escapeHtml(tool)}</span>`);
  if (entry.priority) badges.push(`<span class="badge pri">priority</span>`);
  badges.push(`<span class="badge cat">${escapeHtml(cat)}</span>`);
  if (miss.length) {
    const needs = miss.map((t) => escapeHtml(TAG_MAP[t] || t)).join(", ");
    badges.push(`<span class="badge warn">needs: ${needs}</span>`);
  }
  return badges.join(" ");
}

function renderCard(cat, entry, index) {
  const key = favKey(cat, entry.title, entry.cmd);
  const tool = toolBadgeFromCmd(entry.cmd);
  const steps = splitSteps(entry.cmd);
  const missAll = missingTags(entry.cmd);
  const blockAll = shouldBlockCopy(missAll);
  const isCred = isCredentialedTemplate(entry.cmd);

  const card = document.createElement("div");
  card.className = "command-block" + (entry.priority ? " top-priority" : "");
  card.tabIndex = 0;
  card.dataset.index = String(index);
  card.dataset.templateAll = entry.cmd;
  card.dataset.credential = isCred ? "1" : "0";

  const header = document.createElement("div");
  header.className = "card-header";

  const left = document.createElement("div");
  left.className = "card-title";

  const title = document.createElement("div");
  title.className = "title-line";
  title.innerHTML = `<strong>${highlightTitle(entry.title)}</strong>`;

  const meta = document.createElement("div");
  meta.className = "meta-line";
  meta.innerHTML = buildBadges(cat, entry, missAll, tool);

  left.appendChild(title);
  left.appendChild(meta);

  const right = document.createElement("div");
  right.className = "card-actions";

  const favBtn = document.createElement("button");
  favBtn.className = "icon-btn star-btn";
  favBtn.type = "button";
  favBtn.title = "Favorite";
  favBtn.setAttribute("aria-pressed", String(isFav(key)));
  favBtn.textContent = isFav(key) ? "★" : "☆";
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const nowFav = toggleFav(key);
    favBtn.textContent = nowFav ? "★" : "☆";
    favBtn.setAttribute("aria-pressed", String(nowFav));
    toast(nowFav ? "Added to favorites" : "Removed from favorites");
    document.dispatchEvent(new CustomEvent("oscp:filterRequested"));
  });

  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.type = "button";
  copyBtn.textContent = "Copy";
  copyBtn.disabled = !!blockAll;
  copyBtn.title = blockAll ? "Fill required fields to copy" : "Copy all (c)";
  copyBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await copyToClipboard(applyVars(entry.cmd), `Copied: ${entry.title}`);
  });

  right.appendChild(favBtn);
  right.appendChild(copyBtn);

  header.appendChild(left);
  header.appendChild(right);

  const body = document.createElement("div");
  body.className = "card-body";

  if (steps.length === 1) {
    const pre = document.createElement("pre");
    pre.dataset.template = entry.cmd;
    pre.innerHTML = `<code>${highlightCommand(applyVars(entry.cmd))}</code>`;
    body.appendChild(pre);
  } else {
    const stepsWrap = document.createElement("div");
    stepsWrap.className = "steps";

    steps.forEach((tpl, i) => {
      const row = document.createElement("div");
      row.className = "step";

      const num = document.createElement("div");
      num.className = "step-num";
      num.textContent = String(i + 1);

      const pre = document.createElement("pre");
      pre.dataset.template = tpl;
      pre.innerHTML = `<code>${highlightCommand(applyVars(tpl))}</code>`;

      const btn = document.createElement("button");
      btn.className = "step-copy";
      btn.type = "button";
      btn.textContent = "Copy";

      const miss = missingTags(tpl);
      const block = shouldBlockCopy(miss);
      btn.disabled = !!block;
      btn.title = block ? `Needs: ${miss.map((t) => TAG_MAP[t] || t).join(", ")}` : "Copy this step";

      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await copyToClipboard(applyVars(tpl), `Copied step ${i + 1}: ${entry.title}`);
      });

      row.appendChild(num);
      row.appendChild(pre);
      row.appendChild(btn);
      stepsWrap.appendChild(row);
    });

    body.appendChild(stepsWrap);
  }

  card.appendChild(header);
  card.appendChild(body);

  return { el: card, key, priority: !!entry.priority, isCred };
}

export async function buildCategory(cat) {
  const container = dom.commands();
  container.innerHTML = "<p class='empty'>Loading...</p>";
  setStatus("Loading…");

  app.currentEntries = await loadCommands(cat);

  container.innerHTML = "";
  app.cardIndex = [];

  if (!app.currentEntries.length) {
    container.innerHTML = "<p class='empty'>No commands found.</p>";
    setStatus("0 results");
    return;
  }

  const frag = document.createDocumentFragment();
  app.currentEntries.forEach((entry, i) => {
    const built = renderCard(cat, entry, i);
    const searchText = (entry.title + " " + entry.cmd).toLowerCase();
    built.el.dataset.search = searchText;
    built.el.dataset.favkey = built.key;
    app.cardIndex.push({ entry, ...built, searchText });
    frag.appendChild(built.el);
  });

  container.appendChild(frag);

  app.selectedIndex = 0;
  const first = dom.qs(".command-block", container);
  if (first) first.classList.add("selected");

  app.currentCategory = cat;
  scheduleFilter();
}

export function updateRenderedCardsAndBadges() {
  for (const item of app.cardIndex) {
    const card = item.el;
    const templateAll = card.dataset.templateAll || "";
    const missAll = missingTags(templateAll);

    // Update needs badge
    const meta = dom.qs(".meta-line", card);
    if (meta) {
      const warn = dom.qs(".badge.warn", meta);
      if (warn) warn.remove();
      if (missAll.length) {
        const span = document.createElement("span");
        span.className = "badge warn";
        span.textContent = "needs: " + missAll.map((t) => TAG_MAP[t] || t).join(", ");
        meta.appendChild(document.createTextNode(" "));
        meta.appendChild(span);
      }
    }

    // Update code blocks
    dom.qsa("pre", card).forEach((pre) => {
      const tpl = pre.dataset.template || "";
      pre.innerHTML = `<code>${highlightCommand(applyVars(tpl))}</code>`;
    });

    // Update copy buttons
    const copyBtn = dom.qs(".copy-btn", card);
    if (copyBtn) {
      const block = shouldBlockCopy(missAll);
      copyBtn.disabled = !!block;
      copyBtn.title = block ? "Fill required fields to copy" : "Copy all (c)";
    }

    dom.qsa(".step", card).forEach((stepEl) => {
      const pre = dom.qs("pre", stepEl);
      const btn = dom.qs("button", stepEl);
      if (!pre || !btn) return;
      const tpl = pre.dataset.template || "";
      const miss = missingTags(tpl);
      const block = shouldBlockCopy(miss);
      btn.disabled = !!block;
      btn.title = block ? `Needs: ${miss.map((t) => TAG_MAP[t] || t).join(", ")}` : "Copy this step";
    });
  }
}
