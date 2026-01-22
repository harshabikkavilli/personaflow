import { Workflow } from 'lucide-react';

export function ExamplesPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <Workflow className="w-12 h-12 text-[var(--pf-planner)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--pf-text-primary)] mb-2">Examples Gallery</h1>
        <p className="text-[var(--pf-text-muted)]">Coming soon...</p>
      </div>
    </div>
  );
}
