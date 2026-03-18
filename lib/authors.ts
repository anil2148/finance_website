export type AuthorProfile = {
  id: string;
  name: string;
  role: string;
  credentials: string[];
  experience: string;
  bio: string;
  linkedin?: string;
};

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  maya_patel: {
    id: 'maya_patel',
    name: 'Maya Patel',
    role: 'Head of Personal Finance Research',
    credentials: ['MBA (Finance)', 'Former retail-banking product analyst', '10+ years in household budgeting coaching'],
    experience: 'Leads FinanceSphere comparisons, methodology reviews, and calculator QA.',
    bio: 'Maya specializes in turning complex product terms into practical decision frameworks for everyday savers and borrowers.',
    linkedin: 'https://www.linkedin.com/'
  },
  daniel_kim: {
    id: 'daniel_kim',
    name: 'Daniel Kim',
    role: 'Investing & Retirement Editor',
    credentials: ['CFA Level III Candidate', 'B.S. Economics', 'Former robo-advisor content lead'],
    experience: 'Oversees investing, retirement, and risk-management content.',
    bio: 'Daniel focuses on portfolio construction, fee analysis, and evidence-based investing behavior.',
    linkedin: 'https://www.linkedin.com/'
  },
  rachel_nguyen: {
    id: 'rachel_nguyen',
    name: 'Rachel Nguyen',
    role: 'Compliance & Fact-Checking Editor',
    credentials: ['Series 65 (inactive)', 'Certified Financial Education Instructor'],
    experience: 'Reviews disclosures, APR/APY wording, and legal risk statements.',
    bio: 'Rachel validates factual claims and keeps FinanceSphere pages aligned with disclosure and transparency standards.',
    linkedin: 'https://www.linkedin.com/'
  }
};

const categoryAuthorMap: Record<string, string> = {
  investing: 'daniel_kim',
  'retirement-planning': 'daniel_kim',
  'credit-cards': 'maya_patel',
  budgeting: 'maya_patel',
  mortgages: 'maya_patel',
  loans: 'maya_patel'
};

export function getAuthorIdForCategory(category: string) {
  return categoryAuthorMap[category] ?? 'maya_patel';
}
