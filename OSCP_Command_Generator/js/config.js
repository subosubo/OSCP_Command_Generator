// Central config/constants

export const APP_VERSION = "2026-02-18.3";

export const DELIM_STEPS = " ;\n";

export const TAG_MAP = {
  "<target>": "Target IPv4",
  "<target6>": "Target IPv6",
  "<port>": "Target Port",
  "<kali>": "Kali IPv4",
  "<kali6>": "Kali IPv6",
  "<kaliPort>": "Kali Port",
  "<user>": "Username",
  "<password>": "Password",
  "<domain>": "Domain",
  "<dc-ip>": "Domain Controller IP",
  "<ntlm>": "NTLM Hash",
  "<filename1>": "Filename 1",
  "<filename2>": "Filename 2",
  "<wordlist1>": "Wordlist 1",
  "<wordlist2>": "Wordlist 2",
};

export const TAG_TO_ID = {
  "<target>": "target",
  "<target6>": "target6",
  "<port>": "targetPort",
  "<kali>": "kali",
  "<kali6>": "kali6",
  "<kaliPort>": "kaliPort",
  "<user>": "user",
  "<password>": "password",
  "<domain>": "domain",
  "<dc-ip>": "dcIp",
  "<ntlm>": "ntlm",
  "<filename1>": "filename1",
  "<filename2>": "filename2",
  "<wordlist1>": "wordlist1",
  "<wordlist2>": "wordlist2",
};

export const STORAGE = {
  favorites: "oscp_favorites_v1",
  ui: "oscp_ui_v3",
  inputs: "oscp_inputs_v1",
  version: "oscp_app_version",
};
