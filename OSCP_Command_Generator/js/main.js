import { loadCategories } from "./parse.js";
import { populateHelp, toggleHelp } from "./help.js";
import { bindScrollToTop } from "./scroll.js";
import { bindKeyboard } from "./keyboard.js";
import { bindInputRestrictions } from "./validate.js";
import { bindButtons, bindLiveUpdates, bindCategoryDropdownLoadsCommands } from "./events.js";
import { loadUI, enableRememberToggleIfSaved, migrateStorage } from "./storage.js";
import { applyUI } from "./ui_state.js";
import { setStatus } from "./ui.js";

async function init() {
  migrateStorage();

  await loadCategories();

  populateHelp();
  loadUI();
  applyUI();

  bindInputRestrictions();
  bindButtons({ toggleHelp });
  bindKeyboard({ toggleHelp });
  bindLiveUpdates();
  bindScrollToTop();
  bindCategoryDropdownLoadsCommands();

  enableRememberToggleIfSaved();

  setStatus("Ready");
}

init().catch((err) => {
  console.error("Init error:", err);
  setStatus("Error");
});
