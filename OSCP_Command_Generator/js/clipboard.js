import { toast } from "./ui.js";

export async function copyToClipboard(text, okMsg = "Copied") {
  try {
    await navigator.clipboard.writeText(String(text));
    toast(okMsg);
  } catch (err) {
    console.error("clipboard error", err);
    alert("Failed to copy to clipboard");
  }
}
