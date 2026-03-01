import { DELIM_STEPS } from "./config.js";

/**
 * File format (one command per line):
 *   [^]Title:Command text...
 *
 * - '^' at start => priority line
 * - Title is everything before the FIRST ':'
 * - Command is everything after the FIRST ':'
 * - Lines without ':' are accepted (Title="Command", cmd=line)
 *
 * Rendering requirement:
 * - Combine same Title into ONE command card
 * - Each line becomes a step inside that card (numbered + copy per step)
 * - Priority: cards that contain any priority line appear first (order preserved)
 */
export function parseCommandsText(text) {
  const rawLines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.replace(/\r/g, ""))
    .filter((l) => l.trim() !== "");

  // 1) Parse lines
  const lines = [];
  for (let raw of rawLines) {
    let line = raw.trim();
    let priority = false;

    if (line.startsWith("^")) {
      priority = true;
      line = line.slice(1).trim();
    }

    const idx = line.indexOf(":");
    const title = idx === -1 ? "Command" : line.slice(0, idx).trim();
    const cmd = idx === -1 ? line : line.slice(idx + 1).trim();

    lines.push({ title, cmd, priority });
  }

  // 2) Group by title (preserve first-seen order)
  const groups = new Map();
  for (const item of lines) {
    const key = item.title;
    if (!groups.has(key)) {
      groups.set(key, { title: item.title, cmds: [], priority: false });
    }
    const g = groups.get(key);
    g.cmds.push(item.cmd);
    g.priority = g.priority || item.priority;
  }

  const grouped = Array.from(groups.values()).map((g) => ({
    title: g.title,
    cmd: g.cmds.join(DELIM_STEPS),
    priority: g.priority,
  }));

  // 3) Priority cards first; preserve order within each bucket
  const pri = grouped.filter((e) => e.priority);
  const norm = grouped.filter((e) => !e.priority);
  return [...pri, ...norm];
}
