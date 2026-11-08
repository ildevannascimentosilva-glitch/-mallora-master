function slugify(value) {
  return String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function productSEO(product) {
  const slug = product.slug || slugify(product.name);
  return {
    title: `${product.name} | MALLORA`,
    description: (product.description ||
      `Descubra ${product.name} na MALLORA.`).slice(0, 155),
    image: product.image || "",
    canonical: `/produto/${slug}`
  };
}
