import { dom } from "./dom.js";
import { app } from "./state.js";
import {
  validateAllInputs,
  validateField,
  clearSidebarInputs,
} from "./validate.js";
import { clearAllFilters, saveUI, saveNonSensitiveInputs } from "./storage.js";
import { applyUI } from "./ui_state.js";
import { scheduleFilter, selectVisibleCardByIndex } from "./filters.js";
import { buildCategory, updateRenderedCardsAndBadges } from "./render.js";
import { toast } from "./ui.js";
import { clearCommandInfo, scheduleCommandLookup } from "./lookup.js";

export function scheduleRenderedUpdate() {
  if (app._updateScheduled) return;
  app._updateScheduled = true;
  requestAnimationFrame(() => {
    app._updateScheduled = false;
    updateRenderedCardsAndBadges();
    scheduleFilter();
  });
}

export function resetInputsAndFiltersOnly() {
  clearSidebarInputs();
  clearAllFilters();
  clearCommandInfo();

  if (app.currentCategory) {
    scheduleRenderedUpdate();
    scheduleFilter();
  }

  toast("Cleared inputs + filters");
  dom.search().focus();
}

export function bindButtons({ toggleHelp }) {
  dom.helpBtn().addEventListener("click", toggleHelp);

  // Target IPv4 -> DC IP convenience copy
  const copyTargetToDc = document.getElementById("copyTargetToDc");
  if (copyTargetToDc) {
    copyTargetToDc.addEventListener("click", () => {
      const target = document.getElementById("target");
      const dcIp = document.getElementById("dcIp");
      if (!target || !dcIp) return;

      const val = String(target.value || "").trim();
      if (!val) return;

      // Expand any collapsed <details> that contains the DC field
      let node = dcIp;
      while (node) {
        const d = node.closest ? node.closest("details") : null;
        if (!d) break;
        d.open = true;
        node = d.parentElement;
      }

      dcIp.value = val;
      // Trigger normal validation + live updates
      dcIp.dispatchEvent(new Event("input", { bubbles: true }));

      requestAnimationFrame(() => {
        dcIp.scrollIntoView({ block: "center", behavior: "smooth" });
        dcIp.focus({ preventScroll: true });
      });
    });
  }

  dom.toggleCredential().addEventListener("click", () => {
    const next = !app.state.credentialOnly;
    app.state.credentialOnly = next;
    if (next) app.state.nonCredentialOnly = false;
    saveUI();
    applyUI();
    scheduleFilter();
  });

  dom.toggleNonCredential().addEventListener("click", () => {
    const next = !app.state.nonCredentialOnly;
    app.state.nonCredentialOnly = next;
    if (next) app.state.credentialOnly = false;
    saveUI();
    applyUI();
    scheduleFilter();
  });

  dom.togglePriority().addEventListener("click", () => {
    app.state.priorityOnly = !app.state.priorityOnly;
    saveUI();
    applyUI();
    scheduleFilter();
  });

  dom.toggleFavorites().addEventListener("click", () => {
    app.state.favoritesOnly = !app.state.favoritesOnly;
    saveUI();
    applyUI();
    scheduleFilter();
  });

  dom.resetBtn().addEventListener("click", resetInputsAndFiltersOnly);

  document.addEventListener("oscp:filterRequested", () => scheduleFilter());
}

export function bindLiveUpdates() {
  const ids = [
    "target",
    "target6",
    "targetPort",
    "kali",
    "kali6",
    "kaliPort",
    "user",
    "password",
    "domain",
    "dcIp",
    "ntlm",
    "filename1",
    "filename2",
    "wordlist1",
    "wordlist2",
  ];

  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;

    el.addEventListener("input", () => {
      validateField(el);
      if (dom.toggleRemember()?.checked) saveNonSensitiveInputs();
      if (!app.currentCategory) return;
      scheduleRenderedUpdate();
    });
  }

  dom.search().addEventListener("input", () => {
    scheduleFilter();
    scheduleCommandLookup();
  });

  // Global search: click a hit chip to jump to that category (preserving the search term).
  const info = dom.commandInfo?.();
  if (info) {
    info.addEventListener("click", (e) => {
      const btn = e.target?.closest?.(".hit-chip");
      if (!btn) return;

      const cat = decodeURIComponent(btn.getAttribute("data-cat") || "").trim();
      if (!cat) return;

      const term = dom.search()?.value?.trim() || "";
      app.pendingJump = { category: cat, term };

      const sel = dom.category();
      sel.value = cat;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  dom.toggleBlockCopy().addEventListener("change", () => {
    if (!app.currentCategory) return;
    scheduleRenderedUpdate();
  });
}

export function bindCategoryDropdownLoadsCommands() {
  dom.category().addEventListener("change", async () => {
    const selected = dom.category().value;

    if (!selected) {
      app.currentCategory = "";
      app.currentEntries = [];
      app.cardIndex = [];
      dom.commands().innerHTML =
        "<p class='empty'>Select a category to load commands.</p>";
      clearCommandInfo();
      dom.status().textContent = "Ready";
      return;
    }

    clearAllFilters();

    // If a global-search jump is in progress, preserve the term and re-apply it after load.
    const jump = app.pendingJump && app.pendingJump.category === selected ? app.pendingJump : null;
    if (!jump) dom.search().value = "";
    clearCommandInfo();

    if (!validateAllInputs()) return;

    await buildCategory(selected);
    scheduleRenderedUpdate();

    if (jump && jump.term) {
      dom.search().value = jump.term;
      app.pendingJump = null;
      scheduleFilter();
      // Auto-scroll to the first visible hit (fastest exam workflow)
      requestAnimationFrame(() => selectVisibleCardByIndex(0));
    } else {
      scheduleFilter();
    }

    dom.search().focus();
  });
}
