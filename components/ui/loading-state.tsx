export function LoadingState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-6 text-emerald-50">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-100/30 border-t-emerald-100" />
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-emerald-100/90">{description}</p>
    </div>
  );
}
