import { dom } from "./dom.js";
import { app } from "./state.js";
import { validateAllInputs, validateField, clearSidebarInputs } from "./validate.js";
import { clearAllFilters, saveUI, saveNonSensitiveInputs } from "./storage.js";
import { applyUI } from "./ui_state.js";
import { scheduleFilter } from "./filters.js";
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
    "target","target6","targetPort","kali","kali6","kaliPort",
    "user","password","domain","dcIp","ntlm",
    "filename1","filename2","wordlist1","wordlist2"
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
      dom.commands().innerHTML = "<p class='empty'>Select a category to load commands.</p>";
      clearCommandInfo();
      dom.status().textContent = "Ready";
      return;
    }

    clearAllFilters();
    dom.search().value = "";
    clearCommandInfo();

    if (!validateAllInputs()) return;

    await buildCategory(selected);
    scheduleRenderedUpdate();
    scheduleFilter();
    dom.search().focus();
  });
}
