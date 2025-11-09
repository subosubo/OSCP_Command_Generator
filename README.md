# **OSCP Command Generator v1.2.6**

A lightweight, browser-based **command builder** for penetration testers.  
It dynamically loads categorized command templates, supports variable substitution, and now includes **priority sorting**, **enhanced help UI**, and **improved UX refinements**.

---

## **Features**

- **Dynamic Command Categories** – Automatically loads `.txt` files from the `data/` folder  
- **Smart Command Grouping** – Consecutive commands with the same title are merged into one block  
- **Priority Sorting** – Commands starting with `^` appear at the top, sorted alphabetically  
- **Live Variable Substitution** – Commands update in real-time as you type inputs  
- **Searchable Commands** – Instantly filter commands within categories  
- **Copy-to-Clipboard** – One-click copy for ready-to-use commands  
- **Input Validation** – Validates IPv4/IPv6 and port ranges dynamically  
- **Reset Functionality** – Quickly clear all inputs and reload categories  
- **Help Popup** – Displays supported variable tags in a clean table format  
- **Improved UI/UX** – Cleaner layout, glowing hover states, and added margin under the last command block  

---

## **Project Structure**

project-root/  
├── index.html          # Main UI and JavaScript logic  
├── css/  
│   └── style.css       # UI styling and hover glow effects  
└── data/  
    ├── enumeration.txt  
    ├── exploitation.txt  
    ├── privilege_escalation.txt  
    └── ... # Add more categories here  

---

## **Quick Start**

**Local HTTP Server Required**  
Browsers block file access when opened directly — you must serve this over HTTP:

python -m http.server 8000  

Then open in your browser:

http://localhost:8000  

---

## **Usage**

1. Serve the project directory using a local HTTP server.  
2. Open `http://localhost:<port>` in your browser.  
3. Click **Load Commands** to populate the category dropdown.  
4. Choose a category and enter inputs (target, user, password, etc.).  
5. Use **Search** to filter commands dynamically.  
6. Click **Copy** to copy a substituted command.  
7. Click **Reset** to clear all inputs and start over.  
8. Click the **?** button to view supported tag references.

---

## **Supported Variables**

| Variable | Description |
|-----------|--------------|
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

---

## **Adding New Commands**

1. Add a new `.txt` file under `/data/` (e.g., `smb.txt`).  
2. Follow this format:  
   description:command  
3. Use supported tags (`<target>`, `<user>`, etc.) where needed.  
4. Any line starting with `^` will appear at the **top of the command list** and be **sorted alphabetically**.  
5. Reload the page to see your new category in the dropdown.

---

## **Command Format Examples**

ftp (banner): nc -vn <target> <port>  
ftp (anonymous login): ftp <target>  
^nmap (quick start): nmap -sVC -p- -v -T4 -sT --open <target> -oN results_TCP  
^nmap (quick start): sudo nmap -sU -p 1-1024 -v <target> -oA results_UDP  

Commands with identical titles are merged automatically.  
Commands starting with `^` are shown first.

---

## **Requirements**

- **Python 3** or **Node.js** for local HTTP serving  
- **Modern browser** (Chrome, Edge, Firefox)  
- **No additional dependencies**  

---

## **Version History**

**v1.2.6 (2025-11-09)**  
- Added priority sorting (`^`) for top commands  
- Fixed help popup display issue (clean, consistent table view)  
- Added margin below the final command block for visual spacing  
- Enhanced IPv4/port validation  
- Improved glow and hover animation effects  
- Search now clears and refocuses when loading new commands  
- UI/UX refinements and accessibility improvements  

**v1.2.5 (2025-11-08)**  
- Fixed dropdown reset issue after reloading commands  
- Category persistence ensured after reload  
- Minor performance optimization for real-time updates  

**v1.2.4 (2025-11-07)**  
- Improved validation for inputs  
- Help popup added with tag support table  

**v1.2.3 (2025-10-23)**  
- Added sidebar focus on Load Commands  
- Improved live substitution  

**v1.2.2 (2025-11-07)**  
- UI enhancements and smoother input feedback  

---

## **Author**

**Subo Subo**  
Built for penetration testers preparing for **OSCP** and similar certifications.  
Credits to **yuyuloke** for foundational UI and functional logic.

---
