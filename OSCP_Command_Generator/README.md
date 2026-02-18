# OSCP Command Generator

A fast, keyboard-driven command reference and generator built for
OSCP-style workflows.

This tool loads categorized command `.txt` files and dynamically renders
them into searchable, filterable command cards with: - Placeholder
substitution - Priority tagging - Credential filtering - Favorites -
Step-based command grouping - Keyboard shortcuts

------------------------------------------------------------------------

## 🚀 Getting Started

### 1️⃣ Serve the Project

This project must be served via a local web server (not opened directly
via `file://`).

Example using Python:

``` bash
cd OSCP_Command_Generator
python -m http.server 8081
```

Then open:

http://localhost:8081

------------------------------------------------------------------------

## 📂 Project Structure

OSCP_Command_Generator/ │ ├── index.html ├── css/ ├── js/ ├── data/ │
├── 01_Network_Enumeration.txt │ ├── 02_Web_Enumeration_and_attacks.txt
│ ├── ... │ └── manifest.json └── README.md

------------------------------------------------------------------------

## 🧠 How Command Files Work

Each `.txt` file inside `/data` represents one category.

### File Format

Each line must follow:

\[\^\]Title:Command

### Rules

-   `^` at the beginning = Priority command
-   Everything before the first `:` = Card Title
-   Everything after the first `:` = Command text
-   One line = one command step
-   Lines with the same Title are automatically grouped into one card
    with numbered steps

------------------------------------------------------------------------

## 📝 Example

\^Network notes:Scan all TCP Ports \^Network notes:Scan UDP Ports ftp:nc
-vn `<target>`{=html} `<port>`{=html} ftp:ftp `<target>`{=html}

This becomes:

-   One Network notes priority card with 2 steps
-   One ftp card with 2 steps

------------------------------------------------------------------------

## ➕ Adding a New Category

1.  Create a new `.txt` file inside `/data` Example:

14_New_Category.txt

2.  Add your commands in the required format.

3.  Update `manifest.json` inside `/data` and add your new filename
    WITHOUT `.txt` extension:

\[ "01_Network_Enumeration", "14_New_Category"\]

4.  Refresh browser (Ctrl + Shift + R).

------------------------------------------------------------------------

## ➖ Removing a Category

1.  Delete the `.txt` file from `/data`
2.  Remove its entry from `manifest.json`
3.  Refresh browser

------------------------------------------------------------------------

## 🔄 Regenerating manifest.json (Optional)

If using `create.bat`, you can regenerate `manifest.json` automatically
from all `.txt` files inside `/data`.

Run:

create.bat

------------------------------------------------------------------------

## ⌨️ Keyboard Shortcuts

/ → Focus search\
j → Next command\
k → Previous command\
c → Copy selected command\
Ctrl + +/- → Adjust font size\
Esc → Close help panel

------------------------------------------------------------------------

## 🔐 Placeholders

Common placeholders:

-   `<target>`{=html}
-   `<port>`{=html}
-   `<user>`{=html}
-   `<password>`{=html}
-   `<domain>`{=html}
-   `<filename1>`{=html}
-   `<wordlist1>`{=html}

Click the ? help button in the UI to see all supported tags.

------------------------------------------------------------------------

## 🛠 Troubleshooting

Commands not loading? - Ensure you are running via http:// - Check
manifest.json - Check browser DevTools Console for errors - Hard refresh
(Ctrl + Shift + R)

Only partial commands show? - Ensure `.txt` file has proper line breaks
(CRLF or LF) - Open the raw `.txt` in browser to confirm formatting

------------------------------------------------------------------------

## 📌 Notes

-   No backend required
-   Fully static project
-   Designed for fast OSCP exam workflows
-   Safe to host on GitHub Pages

------------------------------------------------------------------------

## License

MIT License
