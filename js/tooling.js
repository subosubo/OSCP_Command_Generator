// Tool detection (token-based, no substring false positives)
export function toolBadgeFromCmd(cmd) {
  const raw = (cmd || "").trim();
  if (!raw) return "";

  // Tokenize while preserving quoted strings
  const tokens = raw.match(/"[^"]*"|'[^']*'|\S+/g) || [];
  const tokensLower = tokens.map((t) => t.toLowerCase());

  // Skip wrappers to find invoked command
  const WRAPPERS = new Set(["sudo", "doas", "env", "command", "stdbuf", "timeout", "nohup"]);

  let i = 0;
  while (i < tokensLower.length && WRAPPERS.has(tokensLower[i])) {
    if (tokensLower[i] === "env") {
      i++;
      while (i < tokens.length && /^[a-z_][a-z0-9_]*=/i.test(tokens[i])) i++;
      continue;
    }
    i++;
  }

  const first = tokensLower[i] || "";

  // PowerShell badge
  if (first === "pwsh" || first === "powershell" || first === "powershell.exe") return "pwsh";
  if (raw.startsWith("$")) return "pwsh";

  const FIRST_TOKEN_TO_BADGE = new Map([
    ["nc", "nc"],
    ["netcat", "nc"],
    ["nmap", "nmap"],
    ["ffuf", "ffuf"],
    ["gobuster", "gobuster"],
    ["feroxbuster", "feroxbuster"],
    ["nikto", "nikto"],
    ["curl", "curl"],
    ["wget", "wget"],
    ["ftp", "ftp"],
    ["ssh", "ssh"],
    ["smbclient", "smbclient"],
    ["rpcclient", "rpcclient"],
    ["crackmapexec", "cme"],
    ["cme", "cme"],
    ["wmiexec.py", "impacket"],
    ["psexec.py", "impacket"],
    ["smbexec.py", "impacket"],
    ["secretsdump.py", "impacket"],
    ["evil-winrm", "evil-winrm"],
    ["hydra", "hydra"],
    ["medusa", "medusa"],
    ["john", "john"],
    ["hashcat", "hashcat"],
    ["dig", "dig"],
    ["nslookup", "nslookup"],
    ["snmpwalk", "snmpwalk"],
    ["onesixtyone", "onesixtyone"],
    ["ldapsearch", "ldapsearch"],
  ]);

  const direct = FIRST_TOKEN_TO_BADGE.get(first);
  if (direct) return direct;

  const TOKEN_TO_BADGE = new Map([
    ["wmiexec.py", "impacket"],
    ["psexec.py", "impacket"],
    ["smbexec.py", "impacket"],
    ["secretsdump.py", "impacket"],
    ["ldapsearch", "ldapsearch"],
    ["nmap", "nmap"],
    ["evil-winrm", "evil-winrm"],
  ]);

  for (const t of tokensLower) {
    const b = TOKEN_TO_BADGE.get(t);
    if (b) return b;
  }

  return "";
}
