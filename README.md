# OSCP Command Generator v1.2.3

A lightweight browser-based command builder for penetration testers. Dynamically loads categorized command templates, substitutes user-defined variables, and provides real-time command generation with smart grouping and improved interface.

## Features

- **Dynamic Command Categories** – Automatically loads .txt files from the data/ folder
- **Smart Command Grouping** – Consecutive commands with the same title are merged into a single command block
- **Live Variable Substitution** – Commands update in real-time as you type inputs
- **Searchable Commands** – Instantly filter commands within categories
- **Copy-to-Clipboard** – One-click copy for ready-to-use commands
- **Input Validation** – Validates IPv4/IPv6 addresses and port ranges
- **Reset Functionality** – Clear all inputs quickly and start fresh
- **Improved UI** – Cleaner layout, responsive input feedback, and clear error highlighting

## Project Structure
project-root/
├── index.html          # Main UI and JavaScript logic
├── css/
│   └── style.css       # UI styling
└── data/
    ├── enumeration.txt
    ├── exploitation.txt
    ├── privilege_escalation.txt
    └── ...             # Add more categories here

## Quick Start

### Local HTTP Server Required

Browsers block fetching local files directly. Serve the project over HTTP for full functionality:

`python -m http.server 8000`

Then open in your browser:  
`http://localhost:8000`

## Usage

1. Serve the project directory with a local HTTP server
2. Open `http://localhost:<port>` in a browser
3. Select a category from the dropdown (auto-populated from `/data`)
4. Enter relevant inputs (target, user, password, etc.)
5. Use the Search field to filter commands
6. Click **Copy** to copy a fully substituted command
7. Click **Reset** to clear all input fields

## Supported Variables

| Variable | Description |
|----------|-------------|
| `<target>` | Target IPv4 |
| `<target6>` | Target IPv6 |
| `<port>` | Target/Kali Port |
| `<kali>` | Kali IPv4 |
| `<kali6>` | Kali IPv6 |
| `<kaliPort>` | Kali Port |
| `<user>` | Username |
| `<password>` | Password |
| `<domain>` | Domain |
| `<dc-ip>` | Domain Controller IP |
| `<ntlm>` | NTLM Hash |
| `<filename1>` | Filename 1 |
| `<filename2>` | Filename 2 |
| `<wordlist1>` | Wordlist 1 |
| `<wordlist2>` | Wordlist 2 |

## Adding New Commands

1. Add a new `.txt` file under `/data/` (e.g., `smb.txt`)
2. Follow the format: `description:command`
3. Use supported tags where appropriate
4. The file will automatically appear in the category dropdown when the page reloads

### Command Format Examples
`ftp (banner): nc -vn <target> <port>`  
`ftp (anonymous login): ftp <target>`  
Multiple consecutive commands with the same title are automatically merged.

## Requirements

- Python 3 or Node.js for local HTTP server
- Modern browser (Chrome, Edge, Firefox)
- No other runtime dependencies

## Version History

**v1.2.3** (2025-11-08)
- Added Help (?) button at top-right to show supported tags with live toggle.
- Help section hidden on page load; click button or popup to toggle visibility.
- Fixed tag display in help section so all supported tags (e.g., <user>, <target>) are clearly shown.
- Cleaned up input validation and live updates for smoother UX.
- Minor refactoring for better readability and maintainability of HTML/JS.

**v1.2.2** (2025-11-07)
- UI improvements for better input feedback and error highlighting
- Preserved smart command grouping and live variable updates
- Improved search responsiveness

**v1.2.1** (2025-11-07)
- Added smart command grouping with merged consecutive commands
- Copy button copies grouped commands as one block

**v1.2** (2025-10-24)
- Added Domain Controller IP and NTLM input support
- Live variable updates implemented
- Improved category loading and validation

## Author

**Subo Subo** – Built for penetration testers preparing for OSCP and similar certifications.

Credits to yuyuloke
