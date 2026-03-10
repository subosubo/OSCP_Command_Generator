const $ = (id) => document.getElementById(id);
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const dom = {
  $,
  qs,
  qsa,

  category: () => $("category"),
  resetBtn: () => $("resetBtn"),
  search: () => $("search"),
  commands: () => $("commands"),
  status: () => $("statusText"),

  helpBtn: () => $("helpBtn"),
  helpPopup: () => $("helpPopup"),
  toTopBtn: () => $("toTopBtn"),
  toast: () => $("toast"),
  main: () => $("mainScroller"),

  toggleCredential: () => $("toggleCredential"),
  toggleNonCredential: () => $("toggleNonCredential"),
  togglePriority: () => $("togglePriority"),
  toggleFavorites: () => $("toggleFavorites"),

  toggleBlockCopy: () => $("toggleBlockCopy"),
  toggleRemember: () => $("toggleRemember"),

  commandInfo: () => $("command"),

  timer20: () => $("timer20"),
  timer40: () => $("timer40"),
  timer90: () => $("timer90"),
  timerStop: () => $("timerStop"),
  timerReadout: () => $("timerReadout"),
};
