export function productMetrics(products = []) {
  const published = products.filter(p =>
    p.status === "published" && p.affiliateUrl && p.image
  );
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const stores = [...new Set(products.map(p => p.store).filter(Boolean))];

  return {
    total: products.length,
    published: published.length,
    drafts: products.length - published.length,
    featured: published.filter(p => p.featured).length,
    categories: categories.length,
    stores: stores.length,
    invalid: products.filter(p =>
      !p.name || !p.affiliateUrl || !p.image
    ).length
  };
}
