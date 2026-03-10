import { dom } from "./dom.js";

let tick = null;
let alarmTick = null;
let endAt = 0;
let activeBtn = null;

const ORIGINAL_TITLE = document.title;
let originalFaviconHref = null;

function getFaviconEl() {
  return document.querySelector("link[rel='icon']");
}

function setFaviconEmoji(emoji) {
  const el = getFaviconEl();
  if (!el) return;
  if (originalFaviconHref == null) originalFaviconHref = el.getAttribute("href") || "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
  el.setAttribute("href", `data:image/svg+xml,${encodeURIComponent(svg)}`);
}

function restoreFavicon() {
  const el = getFaviconEl();
  if (!el) return;
  if (originalFaviconHref != null) el.setAttribute("href", originalFaviconHref);
}

function fmt(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function setReadout(text) {
  const r = dom.timerReadout?.();
  if (r) r.textContent = text;
}

function setAlarm(on) {
  const wrap = document.querySelector(".timer-controls");
  if (!wrap) return;
  wrap.classList.toggle("alarm", !!on);
}

function stopAll() {
  if (tick) clearInterval(tick);
  if (alarmTick) clearInterval(alarmTick);
  tick = null;
  alarmTick = null;
  endAt = 0;
  setAlarm(false);
  setReadout("");
  document.title = ORIGINAL_TITLE;
  restoreFavicon();
  if(activeBtn){ activeBtn.classList.remove('active'); activeBtn = null; }
}

function startMinutes(mins, btn) {
  stopAll();
  if(btn){ activeBtn = btn; btn.classList.add('active'); }
  const now = Date.now();
  endAt = now + mins * 60 * 1000;
  setFaviconEmoji("⏱️");

  // Initial paint
  setReadout(fmt(endAt - now));
  document.title = `${fmt(endAt - now)} • ${ORIGINAL_TITLE}`;

  tick = setInterval(() => {
    const left = endAt - Date.now();
    if (left <= 0) {
      clearInterval(tick);
      tick = null;
      setReadout("00:00");
      triggerAlarm();
      return;
    }
    setReadout(fmt(left));
    document.title = `${fmt(left)} • ${ORIGINAL_TITLE}`;
  }, 250);
}

function triggerAlarm() {
  setAlarm(true);

  // Visual-only alarm: flash favicon + title so it shows in taskbar/tab.
  let on = false;
  alarmTick = setInterval(() => {
    on = !on;
    setFaviconEmoji(on ? "🔴" : "⏱️");
    document.title = on ? `⏰ TIME UP • ${ORIGINAL_TITLE}` : `TIME UP • ${ORIGINAL_TITLE}`;
  }, 700);
}

export function bindExamTimers() {
  // Defensive: don't crash if UI not present
  const b20 = dom.timer20?.();
  const b40 = dom.timer40?.();
  const b90 = dom.timer90?.();
  const stop = dom.timerStop?.();
  if (!b20 || !b40 || !b90 || !stop) return;

  b20.addEventListener("click", () => startMinutes(20, b20));
  b40.addEventListener("click", () => startMinutes(40, b40));
  b90.addEventListener("click", () => startMinutes(90, b90));
  stop.addEventListener("click", stopAll);

  // Stop alarm when navigating away (prevents annoyance if tab is closed)
  window.addEventListener("beforeunload", () => stopAll());
}
