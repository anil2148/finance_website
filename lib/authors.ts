export type AuthorProfile = {
  id: string;
  name: string;
  role: string;
  description?: string;
  bio: string;
  philosophy?: string;
  experience?: string;
};

export const PRIMARY_AUTHOR_ID = 'anil_chowdhary';
export const EDITORIAL_REVIEWER_ID = 'financesphere_editorial_team';

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  [PRIMARY_AUTHOR_ID]: {
    id: PRIMARY_AUTHOR_ID,
    name: 'Anil Chowdhary',
    role: 'Founder, FinanceSphere',
    description: 'Product engineer and personal finance systems builder',
    experience:
      'Built and shipped consumer finance workflows covering calculators, comparison frameworks, and conversion-focused decision content used by readers evaluating debt, savings, mortgage, and investing choices.',
    philosophy:
      'Every recommendation must survive a bad-month scenario: lower income, higher expenses, and tighter liquidity.',
    bio: 'Anil built FinanceSphere after seeing how often people make high-cost decisions with partial information. The platform combines concrete math, comparison filters, and plain-language guidance so readers can move from uncertainty to a documented next step.'
  },
  [EDITORIAL_REVIEWER_ID]: {
    id: EDITORIAL_REVIEWER_ID,
    name: 'FinanceSphere Editorial Team',
    role: 'FinanceSphere Editorial Team',
    bio: 'Fact-check and compliance review completed before publication updates.'
  }
};

export function getAuthorIdForCategory(category: string) {
  void category;
  return PRIMARY_AUTHOR_ID;
}
