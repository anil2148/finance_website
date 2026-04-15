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
  /** Canonical on-site author profile URL */
  profileUrl?: string;
};

export const PRIMARY_AUTHOR_ID = 'financesphere_editorial_team';
export const EDITORIAL_REVIEWER_ID = 'financesphere_editorial_team';

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  [PRIMARY_AUTHOR_ID]: {
    id: PRIMARY_AUTHOR_ID,
    name: 'FinanceSphere Editorial Team',
    role: 'FinanceSphere Editorial Team',
    description: 'Decision-first finance editorial team focused on transparent, scenario-based guidance.',
    bio: 'FinanceSphere Editorial Team produces and reviews calculators, comparisons, and guides using a methodology-first process designed for real household decisions under constraints.',
    methodology:
      'Every page is built around one decision, pressure-tested with downside scenarios, and reviewed for disclosure clarity, factual framing, and internal consistency before publication updates.',
    profileUrl: '/about'
  }
};

export function getAuthorIdForCategory(category: string) {
  void category;
  return PRIMARY_AUTHOR_ID;
}
