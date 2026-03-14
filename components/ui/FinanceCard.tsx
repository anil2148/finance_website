export function FinanceCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="card h-full hover:border-brand">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
    </article>
  );
}
