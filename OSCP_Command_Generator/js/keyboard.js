import { dom } from "./dom.js";
import { app } from "./state.js";
import { toast } from "./ui.js";
import { setFontScale } from "./ui_state.js";
import { saveUI } from "./storage.js";
import { getVisibleCards, selectVisibleCardByIndex, copySelectedCard } from "./filters.js";

function hasSelection() {
  const sel = window.getSelection?.();
  return sel && String(sel.toString() || "").length > 0;
}

export function bindKeyboard({ toggleHelp }) {
  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const inInput =
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.tagName === "SELECT");

    if (!inInput && e.key === "/") {
      e.preventDefault();
      dom.search().focus();
      return;
    }

    if (e.key === "Escape") {
      if (dom.helpPopup().style.display === "block") toggleHelp();
      return;
    }

    // Font controls
    if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
      e.preventDefault();
      setFontScale(app.state.fontScale + 1);
      saveUI();
      toast(`Font: ${app.state.fontScale >= 0 ? "+" : ""}${app.state.fontScale}`);
      return;
    }
    if (e.ctrlKey && e.key === "-") {
      e.preventDefault();
      setFontScale(app.state.fontScale - 1);
      saveUI();
      toast(`Font: ${app.state.fontScale >= 0 ? "+" : ""}${app.state.fontScale}`);
      return;
    }
    if (e.ctrlKey && e.key === "0") {
      e.preventDefault();
      setFontScale(0);
      saveUI();
      toast("Font: 0");
      return;
    }

    if (inInput) return;

    if (e.key === "j") return selectVisibleCardByIndex(app.selectedIndex + 1);
    if (e.key === "k") return selectVisibleCardByIndex(app.selectedIndex - 1);

    // Only trigger single-key copy when user isn't selecting text and not using ctrl/meta
    if (e.key === "c" && !e.ctrlKey && !e.metaKey && !hasSelection()) {
      return copySelectedCard();
    }
  });

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".command-block");
    if (!card) return;
    const visibles = getVisibleCards();
    const idx = visibles.indexOf(card);
    if (idx >= 0) selectVisibleCardByIndex(idx);
  });
}
