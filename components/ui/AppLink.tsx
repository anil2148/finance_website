import Link, { type LinkProps } from 'next/link';
import { cn } from '@/lib/utils';

type LinkVariant = 'editorial' | 'utility' | 'chip' | 'card' | 'breadcrumb';

const variantClassMap: Record<LinkVariant, string> = {
  editorial: 'content-link',
  utility: 'utility-link',
  chip: 'content-link-chip',
  card: 'link-card',
  breadcrumb: 'breadcrumb-link'
};

type AppLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    variant?: LinkVariant;
  };

export function AppLink({ variant = 'utility', className, ...props }: AppLinkProps) {
  return <Link className={cn(variantClassMap[variant], className)} {...props} />;
}
