OSCP Command Generator v1.2.1

A lightweight browser-based command builder for penetration testers.
It dynamically loads categorized command templates, substitutes user-defined variables, supports live updates, search functionality, and now merges related commands for cleaner display.

🚀 Features

Dynamic Command Categories – Automatically loads .txt files from the data/ folder (requires serving over HTTP).

Smart Command Grouping – Consecutive lines in a .txt file with the same title (e.g., Capture the flag:) are now merged into a single command block for better readability.

Commands are joined with ; followed by a newline.

The Copy button copies the full combined command as a single line including newlines.

Live Variable Substitution – Update input fields (e.g., <target>, <kali>, <domain>) and see real-time command updates.

Searchable Commands – Filter commands within a category instantly.

Copy-to-Clipboard – One-click copy for ready-to-use commands.

Input Validation – Checks for valid IPv4/IPv6 addresses and port ranges.

Reset Functionality – Quickly clear all inputs and start fresh.

🗂 Project Structure
project-root/
├── index.html          # Main UI and JavaScript logic
├── css/
│   └── style.css       # UI styling
└── data/
    ├── enumeration.txt         # Example category file
    ├── exploitation.txt
    ├── privilege_escalation.txt
    └── ...                     # Add more categories here

⚠️ Important: local HTTP server required

The app loads category files by fetching data/*.txt with JavaScript.
For security reasons, most browsers block fetch requests to local files when opening index.html via file://.
You must serve the project over HTTP so category loading works correctly.

Quick start (recommended) — Python 3

From the project root (the directory that contains index.html and the data folder), run:

python -m http.server 8000


Then open in your browser:

http://localhost:8000

You may change 8000 to any free port.

Alternatives

Node (http-server): npx http-server -p 8000

Node (serve): npx serve -l 8000

Python (custom port): python -m http.server 3000

🧩 How It Works

Command Templates
Each command file in the data/ folder uses the format:
description:command

Example:

ftp (banner): nc -vn <target> <port>
ftp (anonymous login): ftp <target>


Smart Grouping Example
Consecutive identical titles are now merged:

Before

Capture the flag: find / -name "local.txt" 2>/dev/null
Capture the flag: find / -name "proof.txt" 2>/dev/null


After

Capture the flag
find / -name "local.txt" 2>/dev/null ;
find / -name "proof.txt" 2>/dev/null


When copied, both commands are joined as one multi-line command separated by ; and newline.

Supported Tags
These placeholders are automatically replaced by sidebar inputs:

Tag	Replaced By
<target>	Target IPv4
<target6>	Target IPv6
<port>	Target Port
<kali>	Kali IPv4
<kali6>	Kali IPv6
<kaliPort>	Kali Port
<user>	Username
<password>	Password
<domain>	Domain
<dc-ip>	Domain Controller IP
<ntlm>	NTLM Hash
<filename1>	Filename 1
<filename2>	Filename 2
<wordlist1>	Wordlist 1
<wordlist2>	Wordlist 2

Live Updates
Once commands are loaded, any input change updates all visible commands instantly — no reload needed.

⚙️ Usage (step-by-step)

Serve the project directory with a local HTTP server (see examples above).

Open http://localhost
:<port> in a browser.

Select a category from the dropdown (auto-populated from /data).

Enter relevant inputs (target, user, password, etc.).

Use the Search field to filter commands.

Click Copy to copy a fully substituted (and grouped) command.

Click Reset to clear all input fields.

🧱 Adding New Commands

Add a new .txt file under /data/ (e.g., smb.txt).

Follow the description:command format.

Use the supported tags where appropriate.

Consecutive identical descriptions will automatically merge.

The file appears in the Category dropdown when you reload the page (served via HTTP).

🧰 Requirements

Python 3 (for python -m http.server) or Node.js for alternative servers.

Modern browser (Chrome, Edge, Firefox).

No other runtime dependencies.

🪪 Version

v1.2.1 (2025-11-07)

Added Smart Command Grouping to combine consecutive commands with the same title.

Enhanced copy behavior to include grouped multi-line commands.

Fixed variable substitution across multi-line combined commands.

General UI cleanup and minor performance improvements.

👨‍💻 Author

Subo Subo
Built for penetration testers preparing for OSCP and similar certifications.

Credits to @yuyuloke
