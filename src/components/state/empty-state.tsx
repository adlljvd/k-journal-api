export function EmptyState({ message }: { message: string }) {
  return <div className="rounded-lg border border-dashed p-6 text-center text-sm text-zinc-500">{message}</div>;
}
