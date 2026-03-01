import { app } from "./state.js";
import { dom } from "./dom.js";

export function applyUI() {
  document.body.dataset.font = String(app.state.fontScale);

  dom.toggleCredential()?.setAttribute("aria-pressed", String(!!app.state.credentialOnly));
  dom.toggleNonCredential()?.setAttribute("aria-pressed", String(!!app.state.nonCredentialOnly));
  dom.togglePriority()?.setAttribute("aria-pressed", String(!!app.state.priorityOnly));
  dom.toggleFavorites()?.setAttribute("aria-pressed", String(!!app.state.favoritesOnly));
}

export function setFontScale(next) {
  app.state.fontScale = Math.min(3, Math.max(-2, next));
  applyUI();
}
