export function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterProducts(products, filters = {}) {
  const q = normalize(filters.q);
  const category = normalize(filters.category);
  const store = normalize(filters.store);
  const min = filters.minPrice == null ? null : Number(filters.minPrice);
  const max = filters.maxPrice == null ? null : Number(filters.maxPrice);

  return products.filter(p => {
    const text = normalize([
      p.name, p.description, p.category, p.store, p.brand
    ].join(" "));

    if (q && !text.includes(q)) return false;
    if (category && normalize(p.category) !== category) return false;
    if (store && normalize(p.store) !== store) return false;
    if (min !== null && Number(p.price || 0) < min) return false;
    if (max !== null && Number(p.price || 0) > max) return false;
    return true;
  });
}

export function getStores(products) {
  return [...new Set(products.map(p => p.store).filter(Boolean))].sort();
}

export function getCategories(products) {
  return [...new Set(products.map(p => p.category).filter(Boolean))].sort();
}
