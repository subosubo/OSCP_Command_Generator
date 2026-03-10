import { dom } from "./dom.js";
import { app } from "./state.js";
import { isFav } from "./storage.js";
import { setStatus } from "./ui.js";

let filterScheduled = false;

function getSearchTerm() {
  return (dom.search()?.value || "").trim().toLowerCase();
}

function credentialAllows(cardEl) {
  if (!app.state.credentialOnly && !app.state.nonCredentialOnly) return true;
  const isCred = cardEl.dataset.credential === "1";
  if (app.state.credentialOnly) return isCred;
  return !isCred;
}

function priorityAllows(item) {
  if (!app.state.priorityOnly) return true;
  return item.priority;
}

function favoritesAllows(item) {
  if (!app.state.favoritesOnly) return true;
  return isFav(item.key);
}

function termAllows(item, term) {
  if (!term) return true;
  return item.searchText.includes(term);
}

export function scheduleFilter() {
  if (filterScheduled) return;
  filterScheduled = true;
  requestAnimationFrame(() => {
    filterScheduled = false;
    applyFilters();
  });
}

export function applyFilters() {
  const term = getSearchTerm();
  let shown = 0;

  for (const item of app.cardIndex) {
    const ok =
      termAllows(item, term) &&
      priorityAllows(item) &&
      favoritesAllows(item) &&
      credentialAllows(item.el);

    item.el.style.display = ok ? "" : "none";
    if (ok) shown++;
  }

  setStatus(`${shown} result${shown === 1 ? "" : "s"}`);

  // Maintain selected visible card
  const visibles = app.cardIndex.filter((x) => x.el.style.display !== "none");
  dom.qsa(".command-block.selected", dom.commands()).forEach((c) => c.classList.remove("selected"));
  if (visibles.length) {
    app.selectedIndex = 0;
    visibles[0].el.classList.add("selected");
  }
}

export function getVisibleCards() {
  return app.cardIndex
    .filter((x) => x.el.style.display !== "none")
    .map((x) => x.el);
}

export function selectVisibleCardByIndex(i) {
  const cards = getVisibleCards();
  if (!cards.length) return;

  app.selectedIndex = Math.min(Math.max(0, i), cards.length - 1);
  cards.forEach((c) => c.classList.remove("selected"));

  const card = cards[app.selectedIndex];
  card.classList.add("selected");
  card.focus({ preventScroll: true });
  card.scrollIntoView({ block: "center" });
}

export function copySelectedCard() {
  const cards = getVisibleCards();
  const card = cards[app.selectedIndex];
  if (!card) return;
  const btn = dom.qs(".copy-btn", card);
  if (btn && !btn.disabled) btn.click();
  else setStatus("Fill required fields to copy");
}
