**OSCP Command Generator v1.2.5
**
A lightweight browser-based command builder for penetration testers. Dynamically loads categorized command templates, substitutes user-defined variables, and provides real-time command generation with smart grouping and improved interface.

**Features
**
Dynamic Command Categories – Automatically loads .txt files from the data/ folder

Smart Command Grouping – Consecutive commands with the same title are merged into a single block

Live Variable Substitution – Commands update in real-time as you type inputs

Searchable Commands – Instantly filter commands within categories

Copy-to-Clipboard – One-click copy for ready-to-use commands

Input Validation – Validates IPv4/IPv6 addresses and port ranges

Reset Functionality – Clear all inputs quickly and start fresh

Improved UI – Cleaner layout, responsive input feedback, and clear error highlighting

Project Structure

project-root/
├── index.html # Main UI and JavaScript logic
├── css/
│ └── style.css # UI styling
└── data/
├── enumeration.txt
├── exploitation.txt
├── privilege_escalation.txt
└── ... # Add more categories here

Quick Start
Local HTTP Server Required

Browsers block fetching local files directly. Serve the project over HTTP for full functionality:

python -m http.server 8000

Then open in your browser:
http://localhost:8000

Usage

Serve the project directory with a local HTTP server

Open http://localhost:<port> in a browser

Select a category from the dropdown (auto-populated from /data)

Enter relevant inputs (target, user, password, etc.)

Use the Search field to filter commands

Click Copy to copy a fully substituted command

Click Reset to clear all input fields

Supported Variables
Variable	Description
<target>	Target IPv4
<target6>	Target IPv6
<port>	Target/Kali Port
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
Adding New Commands

Add a new .txt file under /data/ (e.g., smb.txt)

Follow the format: description:command

Use supported tags where appropriate

The file will automatically appear in the category dropdown when the page reloads

Command Format Examples

ftp (banner): nc -vn <target> <port>
ftp (anonymous login): ftp <target>
Multiple consecutive commands with the same title are automatically merged.

Requirements

Python 3 or Node.js for local HTTP server

Modern browser (Chrome, Edge, Firefox)

No other runtime dependencies

Version History

v1.2.5 (2025-11-08)

Fixed bug: Category dropdown no longer resets after clicking Load Commands

Ensures selected category persists and commands are loaded correctly

Minor performance improvements for live updates and search

v1.2.4 (2025-11-07)

UI fixes and enhanced input validation

Help popup shows all supported tags

Command grouping preserved

v1.2.3 (2025-10-23)

Added sidebar input focus on load commands

Live variable substitution improved

v1.2.2 (2025-11-07)

UI improvements and better input feedback

Author

Subo Subo – Built for penetration testers preparing for OSCP and similar certifications.

Credits to yuyuloke
