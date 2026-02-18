export async function smartFetch(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  return await res.text();
}

export async function fetchJson(url) {
  const txt = await smartFetch(url);
  return JSON.parse(txt);
}
