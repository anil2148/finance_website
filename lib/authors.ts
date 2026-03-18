export type AuthorProfile = {
  id: string;
  name: string;
  role: string;
  description?: string;
  bio: string;
};

export const PRIMARY_AUTHOR_ID = 'anil_chowdhary';
export const EDITORIAL_REVIEWER_ID = 'financesphere_editorial_team';

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  [PRIMARY_AUTHOR_ID]: {
    id: PRIMARY_AUTHOR_ID,
    name: 'Anil Chowdhary',
    role: 'Founder, FinanceSphere',
    description: 'Full Stack Developer | Personal Finance Tools Builder',
    bio: 'Anil Chowdhary is the founder of FinanceSphere and a full stack developer focused on building practical personal finance tools, calculators, and comparison resources that help users make better financial decisions.'
  },
  [EDITORIAL_REVIEWER_ID]: {
    id: EDITORIAL_REVIEWER_ID,
    name: 'FinanceSphere Editorial Team',
    role: 'Editorial Review Team',
    bio: 'Editorial quality checks are performed by the FinanceSphere Editorial Team before major updates are published.'
  }
};

export function getAuthorIdForCategory(category: string) {
  void category;
  return PRIMARY_AUTHOR_ID;
}
