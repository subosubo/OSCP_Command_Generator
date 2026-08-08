import { dom } from "./dom.js";

const reIPv6 = /^(([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4})$/;

function isValidIPv4(ip) {
  const parts = String(ip).trim().split(".");
  return parts.length === 4 && parts.every((p) => {
    if (!/^\d+$/.test(p)) return false;
    if (p.length > 1 && p.startsWith("0")) return false;
    const n = Number(p);
    return n >= 0 && n <= 255;
  });
}

function isValidIPv4Cidr(value) {
  const [ip, prefix, extra] = String(value).trim().split("/");
  if (extra !== undefined || prefix === undefined) return false;
  if (!isValidIPv4(ip)) return false;
  if (!/^\d+$/.test(prefix)) return false;
  const n = Number(prefix);
  return n >= 0 && n <= 32;
}

function isValidIPv4OrCidr(value) {
  return isValidIPv4(value) || isValidIPv4Cidr(value);
}

function isValidIPv6(ip) { return reIPv6.test(ip); }
function isValidPort(p) { return /^\d+$/.test(String(p)) && p >= 1 && p <= 65535; }

function showError(input, msg) { input.classList.add("input-error"); input.title = msg; }
function clearError(input) { input.classList.remove("input-error"); input.title = ""; }

export function validateField(input) {
  const id = input.id;
  const val = input.value.trim();
  if (!val) { clearError(input); return true; }

  let ok = true;
  if (id === "target" && !isValidIPv4OrCidr(val)) {
    ok = false; showError(input, "Invalid IPv4 address or CIDR notation");
  }
  if ((id === "kali" || id === "dcIp") && !isValidIPv4(val)) {
    ok = false; showError(input, "Invalid IPv4 address");
  }
  if ((id === "target6" || id === "kali6") && !isValidIPv6(val)) {
    ok = false; showError(input, "Invalid IPv6 address");
  }
  if ((id === "targetPort" || id === "kaliPort") && !isValidPort(Number(val))) {
    ok = false; showError(input, "Port must be 1–65535");
  }

  if (ok) clearError(input);
  return ok;
}

export function validateAllInputs() {
  const ids = ["target","target6","targetPort","kali","kali6","kaliPort","dcIp"];
  let ok = true;
  for (const id of ids) {
    const el = dom.$(id);
    if (el && !validateField(el)) ok = false;
  }
  if (!ok) alert("⚠️ Some fields are invalid. Hover over red fields for details.");
  return ok;
}

export function clearSidebarInputs() {
  dom.qsa(".sidebar input").forEach((i) => (i.value = ""));
  dom.qsa(".input-error").forEach((i) => i.classList.remove("input-error"));
}

function isPossibleIPv4Input(value) {
  const parts = String(value).split(".");
  return (
    parts.length <= 4 &&
    parts.every((p) => {
      if (p === "") return true;
      if (!/^\d+$/.test(p)) return false;
      if (p.length > 3) return false;
      if (p.length > 1 && p.startsWith("0")) return false;
      return Number(p) <= 255;
    })
  );
}

function isPossibleIPv4CidrInput(value) {
  const parts = String(value).split("/");
  if (parts.length > 2) return false;
  if (!isPossibleIPv4Input(parts[0])) return false;

  if (parts.length === 2) {
    const prefix = parts[1];
    if (prefix === "") return true;
    if (!/^\d+$/.test(prefix)) return false;
    if (prefix.length > 2) return false;
    return Number(prefix) <= 32;
  }

  return true;
}

function enableIPField(input, type) {
  input.addEventListener("keydown", (e) => {
    if (e.ctrlKey && ["c","v","a","x"].includes(e.key.toLowerCase())) return;

    const allowed = ["Backspace","ArrowLeft","ArrowRight","Delete","Tab","Home","End"];
    if (allowed.includes(e.key)) return;

    if (type === "ipv4") {
      if (!/[0-9.]/.test(e.key)) return e.preventDefault();

      const caret = input.selectionStart;
      const next = input.value.slice(0, caret) + e.key + input.value.slice(caret);
      if (!isPossibleIPv4Input(next)) return e.preventDefault();

      if (e.key === "." && (caret === 0 || input.value[caret - 1] === "." || input.value[caret] === ".")) {
        return e.preventDefault();
      }
    }

    if (type === "ipv4cidr") {
      if (!/[0-9./]/.test(e.key)) return e.preventDefault();

      const caret = input.selectionStart;
      const next = input.value.slice(0, caret) + e.key + input.value.slice(caret);
      if (!isPossibleIPv4CidrInput(next)) return e.preventDefault();

      if (e.key === "." && (caret === 0 || input.value[caret - 1] === "." || input.value[caret] === ".")) {
        return e.preventDefault();
      }

      if (e.key === "/" && (caret === 0 || input.value.includes("/") || input.value[caret - 1] === ".")) {
        return e.preventDefault();
      }
    }

    if (type === "ipv6") {
      if (!/[0-9a-fA-F:]/.test(e.key)) return e.preventDefault();
    }
  });
}

function enablePortField(el) {
  el.addEventListener("keydown", (e) => {
    const allowed = ["Backspace","ArrowLeft","ArrowRight","Delete","Tab","Home","End"];
    if (allowed.includes(e.key)) return;
    if (!/[0-9]/.test(e.key)) return e.preventDefault();

    const c = el.selectionStart;
    const p = el.value.slice(0, c) + e.key + el.value.slice(c);
    if (Number(p) > 65535) return e.preventDefault();
  });

  el.addEventListener("input", () => {
    const val = el.value.trim();
    if (!val || (Number(val) >= 1 && Number(val) <= 65535)) clearError(el);
    else showError(el, "Port must be 1–65535");
  });
}

export function bindInputRestrictions() {
  enableIPField(dom.$("target"), "ipv4cidr");
  ["kali","dcIp"].forEach((id) => enableIPField(dom.$(id), "ipv4"));
  ["target6","kali6"].forEach((id) => enableIPField(dom.$(id), "ipv6"));
  ["targetPort","kaliPort"].forEach((id) => enablePortField(dom.$(id)));
}
