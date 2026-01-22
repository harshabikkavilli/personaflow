import { Link } from 'react-router-dom';
import { Workflow, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Workflow className="w-12 h-12 text-[var(--pf-planner)]" />
          <h1 className="text-4xl font-bold text-[var(--pf-text-primary)]">PersonaFlow</h1>
        </div>
        
        <p className="text-xl text-[var(--pf-text-secondary)] mb-8">
          Visual system designer for multi-agent AI systems.
          <br />
          <span className="text-[var(--pf-text-muted)]">Coming soon...</span>
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Open Editor
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/examples"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--pf-border)] text-[var(--pf-text-secondary)] rounded-lg font-medium hover:border-[var(--pf-text-muted)] hover:text-[var(--pf-text-primary)] transition-colors"
          >
            View Examples
          </Link>
        </div>
      </div>
    </div>
  );
}
