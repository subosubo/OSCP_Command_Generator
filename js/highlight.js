import { escapeHtml } from "./util.js";

export function highlightTitle(title) {
  const esc = escapeHtml(title);
  // highlight hashtags as comments only if NOT followed by a digit
  return esc.replace(
    /(^|\s)(#(?!\d)[^\r\n]*)$/gm,
    `$1<span class="comment">$2</span>`,
  );
}

export function highlightCommand(text) {
  let out = escapeHtml(text);

  // placeholders
  out = out.replace(/(&lt;[^&]+&gt;)/g, `<span class="ph">$1</span>`);

  // flags
  out = out.replace(
    /(^|\s)(--?[a-zA-Z0-9][a-zA-Z0-9-]*)/g,
    `$1<span class="flag">$2</span>`,
  );

  // operators
  out = out.replace(/(\||&gt;|&lt;|&amp;&amp;|\|\|)/g, `<span class="op">$1</span>`);

  // comments (#...) but NOT numbering like #1, #2, #123
  out = out.replace(
    /(^|\s)(#(?!\d)[^\r\n]*)$/gm,
    `$1<span class="comment">$2</span>`,
  );

  return out;
}
