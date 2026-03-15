import Link from 'next/link';

const links = [
  ['Calculators', '/calculators'],
  ['Tools', '/tools'],
  ['Dashboard', '/dashboard'],
  ['Comparison', '/comparison'],
  ['Blog', '/blog']
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link className="text-lg font-semibold text-brand" href="/">FinanceSite</Link>
        <ul className="flex gap-4 text-sm">
          {links.map(([label, href]) => (
            <li key={href}><Link className="hover:text-brand" href={href}>{label}</Link></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
