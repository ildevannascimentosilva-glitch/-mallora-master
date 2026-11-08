export function scoreProduct(p) {
  let score = 0;
  const price = Number(p.price || 0);
  const old = Number(p.oldPrice || 0);

  if (p.rating) score += Math.min(5, Number(p.rating)) * 8;
  if (price > 0 && old > price)
    score += Math.min(25, ((old - price) / old) * 50);
  if (p.featured) score += 10;
  if (p.image) score += 5;
  if ((p.description || "").length >= 30) score += 5;
  if (p.affiliateUrl) score += 5;

  return Math.round(Math.min(100, score));
}

export function rankProducts(products) {
  return products
    .filter(p => p.status === "published" && p.affiliateUrl)
    .map(p => ({ ...p, curationScore: scoreProduct(p) }))
    .sort((a, b) => b.curationScore - a.curationScore);
}

export function featuredProducts(products, limit = 8) {
  return rankProducts(products)
    .filter(p => p.featured)
    .slice(0, limit);
}

export function bestOffers(products, limit = 8) {
  return rankProducts(products)
    .filter(p => Number(p.oldPrice || 0) > Number(p.price || 0))
    .sort((a, b) =>
      ((b.oldPrice - b.price) / b.oldPrice) -
      ((a.oldPrice - a.price) / a.oldPrice)
    )
    .slice(0, limit);
}
