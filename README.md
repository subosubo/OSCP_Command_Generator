# OSCP Command Generator v1.2.1

A lightweight browser-based **command builder** for penetration testers.  
It dynamically loads categorized command templates, substitutes user-defined variables, supports live updates, search functionality, and now merges related commands for cleaner display.

---

## 🚀 Features

- **Dynamic Command Categories** – Automatically loads `.txt` files from the `data/` folder (requires serving over HTTP).
- **Smart Command Grouping** – Consecutive lines in a `.txt` file with the same title (e.g., `Capture the flag:`) are merged into a single command block.  
  Combined commands are joined with a newline so they appear neatly but copy as one combined command.
- **Live Variable Substitution** – Update sidebar inputs (like `<target>`, `<kali>`, `<domain>`) and see real-time changes in commands.
- **Searchable Commands** – Quickly filter commands within a category.
- **Copy-to-Clipboard** – One-click copy for ready-to-use commands.
- **Input Validation** – Checks for valid IPv4/IPv6 and port ranges.
- **Reset Functionality** – Quickly clear all fields.

---

## 🗂 Project Structure

