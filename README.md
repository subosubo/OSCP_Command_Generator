OSCP Command Generator v1.2.1

A lightweight browser-based command builder for penetration testers.
Designed for OSCP-style workflows, it loads categorized command templates, substitutes user-defined variables, supports live search and updates, and groups related commands into clean, copyable blocks.

🚀 Features

Dynamic Category Loading
Automatically loads .txt command files from the /data directory.

Smart Command Grouping
Consecutive lines with the same title are merged into one block (copied as a single combined command).

Live Variable Substitution
All placeholders (like <target>, <user>, <domain>) are replaced instantly as you type.

Search & Filter
Quickly find commands within a selected category.

Copy-to-Clipboard
Copy fully substituted commands with one click.

Input Validation
Prevents invalid IPs and port values before rendering.

Reset Functionality
Instantly clear all input fields and start fresh.

🗂️ Project Structure
project-root/
├── index.html             # Main interface and JavaScript logic
├── css/
│   └── style.css          # UI styles
└── data/
    ├── enumeration.txt
    ├── exploitation.txt
    ├── privilege_escalation.txt
    └── misc.txt

🧩 How It Works
1. Command Templates

Each .txt file inside /data defines command templates using:

description:command


Example:

ftp (banner): nc -vn <target> <port>
ftp (anonymous login): ftp <target>


Multiple lines with the same title are grouped together:

Capture the flag: find / -name "local.txt" 2>/dev/null
Capture the flag: cat /path/to/local.txt


They appear as one block:

find / -name "local.txt" 2>/dev/null
cat /path/to/local.txt

2. Supported Tags
Tag	Description
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

These tags are replaced live based on sidebar input fields.

⚙️ Running Locally

Modern browsers block fetch() from reading local files directly (file://).
You must run a local HTTP server to use this app.

Option 1: Python (Recommended)

From the project root:

python -m http.server 8000


Then open:

http://localhost:8000


You can change 8000 to any other port.

Option 2: Node.js Alternatives
# Using http-server
npx http-server -p 8000

# Using serve
npx serve -l 8000

🧠 Usage

Start the web server (python -m http.server 8000).

Open your browser at http://localhost:8000.

Choose a category from the dropdown (auto-detected from /data).

Fill in target, credentials, or other fields.

Use Search to filter commands.

Click Copy to copy ready-to-run commands.

Use Reset to clear all inputs.

🪄 Adding New Commands

Create a new .txt file inside /data/ (e.g. smb.txt).

Write commands in the description:command format.

Use supported tags where needed.

Reload the page — your new category will appear automatically.

🧰 Validation Rules

IPv4 / IPv6 formats are validated before rendering.

Port fields must be between 1–65535.

Invalid fields will show alerts instead of rendering commands.

🧾 Example

Input

Field	Value
Target	192.168.1.10
User	admin
Password	pass123

Template

ftp login: ftp <target> -u <user> -p <password>


Output

ftp login: ftp 192.168.1.10 -u admin -p pass123

🧱 Requirements

Python 3 or Node.js (for local web server)

Modern web browser (Chrome, Edge, Firefox)

No external dependencies

🧩 Version History
v1.2.1 — 2025-11-07

Added smart command grouping

Combined commands copy as single block

Improved clipboard logic

Preserved live updates and validation

v1.2 — 2025-10-24

Added <dc-ip> and <ntlm> support

Enabled real-time variable updates

Improved validation and documentation

👨‍💻 Author

Subo Subo
Built for penetration testers and OSCP practitioners.

Credits: @yuyuloke
