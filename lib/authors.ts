export type AuthorProfile = {
  id: string;
  name: string;
  role: string;
  description?: string;
  bio: string;
  philosophy?: string;
  experience?: string;
  /** Formal credentials, designations, or certifications */
  credentials?: string[];
  /** Years of experience in the field */
  yearsOfExperience?: number;
  /** Primary subject-matter expertise areas */
  expertise?: string[];
  /** How the author approaches financial content creation */
  methodology?: string;
};

export const PRIMARY_AUTHOR_ID = 'anil_chowdhary';
export const EDITORIAL_REVIEWER_ID = 'financesphere_editorial_team';

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  [PRIMARY_AUTHOR_ID]: {
    id: PRIMARY_AUTHOR_ID,
    name: 'Smita Chowdhary',
    role: 'Founder & Lead Editor, FinanceSphere',
    description: 'Consumer finance systems designer and personal finance researcher with 10+ years building decision tools for household financial planning',
    yearsOfExperience: 10,
    credentials: ['Product Engineering, Financial Systems', 'Personal Finance Research & Modeling'],
    expertise: ['Mortgage & Home Buying', 'Debt Payoff Strategy', 'Investment Basics', 'Savings Rate Optimization', 'Tax-Efficient Accounts'],
    experience:
      'Built and shipped consumer finance workflows covering calculators, comparison frameworks, and scenario-based decision content used by readers evaluating debt, savings, mortgage, and investing choices. Specializes in translating complex financial math into plain-language guidance that holds up in real household budgets — not just best-case projections.',
    philosophy:
      'Every recommendation must survive a bad-month scenario: lower income, higher expenses, and tighter liquidity. A plan that only works when everything goes right is not a real plan.',
    methodology:
      'Each article starts from the question "what does someone actually get wrong here?" rather than from a product pitch. Content is built around specific financial thresholds, real failure modes, and a documented next step — not generic advice that sounds useful but does not change behavior.',
    bio: 'Smita built FinanceSphere after recognizing how frequently people make high-cost financial decisions — mortgages, credit cards, debt payoff plans — with incomplete information and no way to stress-test their assumptions. She combines product engineering discipline with personal finance research to build tools and guides that give readers a concrete, defensible next step rather than a generic explanation. Her content process starts with the common mistake, works backward to the root cause, and ends with a calculator-backed framework readers can apply the same day.'
  },
  [EDITORIAL_REVIEWER_ID]: {
    id: EDITORIAL_REVIEWER_ID,
    name: 'FinanceSphere Editorial Team',
    role: 'FinanceSphere Editorial Team',
    bio: 'Every article on FinanceSphere completes a two-pass review: a factual accuracy pass for financial thresholds and scenario math, and a disclosure check ensuring all limitations, risks, and conflicts of interest are explicitly stated before publication.'
  }
};

export function getAuthorIdForCategory(category: string) {
  void category;
  return PRIMARY_AUTHOR_ID;
}
