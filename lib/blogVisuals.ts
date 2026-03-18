export type BlogVisual = {
  src: string;
  alt: string;
};

export function getBlogVisual(category: string): BlogVisual {
  const normalized = category.toLowerCase();

  if (normalized.includes('invest')) {
    return {
      src: '/images/blog-visual-investing.svg',
      alt: 'Investment dashboard illustration with portfolio chart and growth trend'
    };
  }

  if (normalized.includes('credit') || normalized.includes('loan') || normalized.includes('mortgage')) {
    return {
      src: '/images/blog-visual-credit.svg',
      alt: 'Financial planning illustration with credit card, loan checklist, and APR trend chart'
    };
  }

  if (normalized.includes('tax')) {
    return {
      src: '/images/blog-visual-tax.svg',
      alt: 'Tax planning illustration showing documents, calculator, and yearly financial timeline'
    };
  }

  if (normalized.includes('sav') || normalized.includes('budget') || normalized.includes('retirement')) {
    return {
      src: '/images/blog-visual-saving.svg',
      alt: 'Budgeting and savings illustration with envelopes, goals, and automated transfer indicators'
    };
  }

  return {
    src: '/images/blog-visual-general.svg',
    alt: 'Personal finance illustration with mobile banking, charts, and financial checklist'
  };
}
