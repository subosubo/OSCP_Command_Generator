# OSCP Command Generator v1.2.1

A lightweight browser-based command builder for penetration testers. It dynamically loads categorized command templates, substitutes user-defined variables, supports live updates, search functionality, and now merges related commands for cleaner display.

---

## 🚀 Features

- **Dynamic Command Categories** – Automatically loads `.txt` files from the `data/` folder (requires serving over HTTP).
- **Smart Command Grouping** – Consecutive lines in a `.txt` file with the same title (e.g., `Capture the flag:`) are merged into a single command block.  
  Combined commands are joined with a newline so they appear neatly but copy as one combined command.
- **Live Variable Substitution** – Update sidebar inputs (like `<target>`, `<kali>`, `<domain>`) and see real-time changes in commands.
- **Searchable Commands** – Quickly filter commands within a category.
- **Copy-to-Clipboard** – One-click copy for ready-to-use commands.
- **Input Validation** – Checks for valid IPv4/IPv6 and port ranges.
- **Reset Functionality** – Quickly clear all fields and start fresh.

---

🗂 Project Structure

project-root/
├── index.html # Main UI and JavaScript logic
├── css/
│ └── style.css # UI styling
└── data/
├── enumeration.txt # Example category file
├── exploitation.txt
├── privilege_escalation.txt
└── ... # Add more categories here

---

## ⚠️ Important: local HTTP server required

The app loads category files by fetching `data/*.txt` with JavaScript. For security reasons most browsers block fetch requests to local files when opening `index.html` via file://. You must serve the project over HTTP so the category loading works correctly.

### Quick start (recommended) — Python 3

From the project root (the directory that contains `index.html` and the `data` folder) run:

python -m http.server 8000

Then open in your browser:

[http://localhost:8000](http://localhost:8000)

You may change `8000` to any free port.

### Alternatives

* Node (http-server): `npx http-server -p 8000`
* Node (serve): `npx serve -l 8000`
* Python (custom port): `python -m http.server 3000`

---

## 🧩 How It Works

1. **Command Templates**
   Each command file in the `data/` folder uses the format:
   description:command

   Example:
   ftp (banner): nc -vn <target> <port>
   ftp (anonymous login): ftp <target>

2. **Supported Tags**
   These placeholders are automatically replaced by the sidebar inputs:
   Tag -> Replaced By
   `<target>` -> Target IPv4
   `<target6>` -> Target IPv6
   `<port>` -> Target Port
   `<kali>` -> Kali IPv4
   `<kali6>` -> Kali IPv6
   `<kaliPort>` -> Kali Port
   `<user>` -> Username
   `<password>` -> Password
   `<domain>` -> Domain
   `<dc-ip>` -> Domain Controller IP
   `<ntlm>` -> NTLM Hash
   `<filename1>` -> Filename 1
   `<filename2>` -> Filename 2
   `<wordlist1>` -> Wordlist 1
   `<wordlist2>` -> Wordlist 2

3. **Live Updates**
   Once commands are loaded, any input change updates all visible commands instantly — no need to reload.

---

## ⚙️ Usage (step-by-step)

1. Serve the project directory with a local HTTP server (see examples above).
2. Open [http://localhost](http://localhost):<port> in a browser.
3. Select a category from the dropdown (auto-populated from `/data`).
4. Enter relevant inputs (target, user, password, etc.).
5. Use the Search field to filter commands.
6. Click **Copy** to copy a fully substituted command.
7. Click **Reset** to clear all input fields.

---

## 🧱 Adding New Commands

* Add a new `.txt` file under `/data/` (e.g., `smb.txt`).
* Follow the `description:command` format.
* Use the supported tags where appropriate.
* The file will automatically appear in the Category dropdown when you reload the page served from the HTTP server.

---

## 🧰 Requirements

* Python 3 (for `python -m http.server`) or Node.js for alternative servers.
* Modern browser (Chrome, Edge, Firefox).
* No other runtime dependencies.

---

## 🪪 Version History

### v1.2.1 (2025-11-07)
- Added **smart command grouping** — consecutive commands with the same title are merged into one block.
- Commands joined with newline + semicolon for readable multi-command display.
- Copy button now copies grouped commands as one.
- Preserved all prior functionality (live updates, validation, etc.).

### v1.2 (2025-10-24)
- Added Domain Controller IP and NTLM input support.
- Implemented live variable updates.
- Improved category loading and validation.
- Updated documentation to require serving over HTTP.

---

## 👨‍💻 Author

**Subo Subo**
Built for penetration testers preparing for OSCP and similar certifications.

@credits to yuyuloke
---
