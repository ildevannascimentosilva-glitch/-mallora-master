const normalize = value =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const isHttpUrl = value => {
  try {
    const u = new URL(String(value || ''));
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
};

export function scoreProduct(product = {}) {
  let score = 0;
  const checks = [];

  const add = (condition, points, label) => {
    if (condition) {
      score += points;
      checks.push(label);
    }
  };

  add(Boolean(product.name?.trim()), 10, 'nome');
  add(Boolean(product.description?.trim()), 10, 'descricao');
  add(Boolean(product.category?.trim()), 10, 'categoria');
  add(isHttpUrl(product.image), 15, 'imagem');
  add(isHttpUrl(product.affiliateUrl), 20, 'link_afiliado');
  add(product.price !== undefined && product.price !== null &&
      String(product.price).trim() !== '', 10, 'preco');
  add(Boolean(product.slug || product.id), 5, 'identificador');
  add(Boolean(product.featured), 5, 'destaque');
  add(product.status === 'published', 5, 'publicado');
  add(Boolean(product.store), 5, 'loja');

  return {
    score: Math.min(100, score),
    checks,
    grade: score >= 85 ? 'A' :
           score >= 65 ? 'B' :
           score >= 40 ? 'C' : 'D'
  };
}

export function rankIntelligent(products = []) {
  return products
    .map(product => ({
      ...product,
      intelligence: scoreProduct(product)
    }))
    .sort((a, b) =>
      b.intelligence.score - a.intelligence.score
    );
}

export function getProductQuality(product = {}) {
  const result = scoreProduct(product);
  return {
    ...result,
    ready: result.score >= 85 &&
      product.status === 'published' &&
      isHttpUrl(product.affiliateUrl)
  };
}

export function normalizeMalloraCategory(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}


// MALLORA FULL V8 - ranking inteligente integrado
export function rankProductsV8(products = [], options = {}) {
  const {
    featuredOnly = false,
    publishedOnly = true
  } = options;

  const eligible = products.filter(product => {
    if (!product || typeof product !== 'object') return false;

    if (publishedOnly && product.status !== 'published') return false;

    if (publishedOnly &&
        (!product.affiliateUrl ||
         !/^https?:\/\//i.test(product.affiliateUrl))) {
      return false;
    }

    if (featuredOnly && !product.featured) return false;

    return true;
  });

  return rankIntelligent(eligible).map((product, index) => ({
    ...product,
    intelligencePosition: index + 1
  }));
}

// Indicador de qualidade para cards e páginas
export function intelligenceBadge(product = {}) {
  const q = getProductQuality(product);

  return {
    score: q.score,
    grade: q.grade,
    ready: q.ready,
    label: 'Mallora Score ' + q.score + '/100'
  };
}
