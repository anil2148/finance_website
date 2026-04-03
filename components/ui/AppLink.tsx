import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type AppLinkVariant = 'editorial' | 'utility' | 'chip' | 'card' | 'breadcrumb';

type AppLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  variant?: AppLinkVariant;
};

const variantClasses: Record<AppLinkVariant, string> = {
  editorial: 'content-link',
  utility: 'utility-link',
  chip: 'content-link-chip',
  card: 'link-card',
  breadcrumb: 'breadcrumb-link'
};

export function AppLink({ className, variant = 'utility', ...props }: AppLinkProps) {
  return <Link {...props} className={cn(variantClasses[variant], className)} />;
}
