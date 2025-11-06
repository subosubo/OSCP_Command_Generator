OSCP Command Generator v1.2.1

A lightweight browser-based command builder for penetration testers.
It dynamically loads categorized command templates, substitutes user-defined variables, supports live updates, search functionality, and now merges related commands for cleaner display.

🚀 Features

Dynamic Command Categories – Automatically loads .txt files from the data/ folder (requires serving over HTTP).

Smart Command Grouping – Consecutive lines in a .txt file with the same title (e.g., Capture the flag:) are merged into a single command block. Combined commands are joined with a newline so they appear neatly but copy as one combined command.

Live Variable Substitution – Update sidebar inputs (like <target>, <kali>, <domain>) and see real-time changes in commands.

Searchable Commands – Quickly filter commands within a category.

Copy-to-Clipboard – One-click copy for ready-to-use commands.

Input Validation – Checks for valid IPv4/IPv6 and port ranges.

Reset Functionality – Quickly clear all fields and start fresh.

🗂 Project Structure
project-root/
├── index.html             # Main UI and JavaScript logic
├── css/
│   └── style.css          # UI styling
└── data/
    ├── enumeration.txt
    ├── exploitation.txt
    ├── privilege_escalation.txt
    └── misc.txt           # Example category file

⚠️ Serving Locally (Required)

Because browsers block fetch() from local files, you must serve the app over HTTP.

Quick Start (Python 3)
python -m http.server 8000


Then open your browser at:

http://localhost:8000

Alternatives
# Node.js (http-server)
npx http-server -p 8000

# Node.js (serve)
npx serve -l 8000

# Python custom port
python -m http.server 3000

🧩 How It Works
1. Command Templates

Each file under /data/ follows this format:

description:command


Example:

ftp (banner): nc -vn <target> <port>
ftp (anonymous login): ftp <target>


When two or more consecutive lines share the same title, they are grouped:

Capture the flag: find / -name "local.txt" 2>/dev/null
Capture the flag: cat /path/to/local.txt


They will appear as one block:

find / -name "local.txt" 2>/dev/null
cat /path/to/local.txt

2. Supported Tags
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
3. Live Updates

After loading commands, any change in the sidebar automatically refreshes all visible commands — no reload required.

⚙️ Usage

Serve the directory using an HTTP server.

Open http://localhost:<port> in your browser.

Select a category from the dropdown (auto-loaded from /data).

Enter target information or credentials.

Use the search box to filter commands.

Click Copy to copy the ready command(s).

Click Reset to clear all input fields.

🧱 Adding New Commands

Create a new .txt file under /data/.

Use the format description:command.

Use supported tags where needed.

Files appear automatically in the category dropdown once saved.

🧰 Requirements

Python 3 (for python -m http.server) or Node.js.

A modern browser (Chrome, Edge, Firefox).

No external dependencies.

🪪 Version History
v1.2.1 (2025-11-07)

Added smart command grouping — consecutive commands with the same title are merged into one block.

Commands joined with newline + semicolon for readable multi-command display.

Copy button now copies grouped commands as one.

Preserved all prior functionality (live updates, validation, etc.).

v1.2 (2025-10-24)

Added Domain Controller IP and NTLM input support.

Implemented live variable updates.

Improved category loading and validation.

Updated documentation to require serving over HTTP.

👨‍💻 Author

Subo Subo
Built for penetration testers preparing for OSCP and similar certifications.

Credits: @yuyuloke
