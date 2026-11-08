const KEY = "mallora_radar_v3";
const CLICKS = "mallora_clicks_v3";

function categoryKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function save(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function recordInterest(category) {
  if (!category || typeof window === "undefined") return;

  const key = categoryKey(category);
  if (!key) return;

  const data = read(KEY, {});
  data[key] = (Number(data[key]) || 0) + 1;
  save(KEY, data);
}

export function getInterests() {
  return read(KEY, {});
}

export function clearInterests() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(CLICKS);
  } catch {}
}

export function trackAffiliateClick(product = {}) {
  if (typeof window === "undefined") return;

  const clicks = read(CLICKS, []);
  clicks.push({
    product: product.name || "Produto",
    category: categoryKey(product.category),
    time: new Date().toISOString()
  });

  save(CLICKS, clicks.slice(-500));
}

export function getClicks() {
  return read(CLICKS, []);
}

export function recommendProducts(products, limit = 6) {
  const interests = getInterests();

  return [...products]
    .filter(p => p.status === "published" && p.affiliateUrl)
    .sort((a, b) =>
      (Number(interests[categoryKey(b.category)]) || 0) -
      (Number(interests[categoryKey(a.category)]) || 0) ||
      scoreFallback(b) - scoreFallback(a)
    )
    .slice(0, limit);
}

function scoreFallback(p) {
  return (p.featured ? 10 : 0) +
    (p.image ? 2 : 0) +
    (p.rating ? Number(p.rating) : 0);
}
