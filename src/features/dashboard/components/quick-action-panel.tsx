import { QuickActions } from "@/features/dashboard/data/quick-actions";
import { QuickActionCard } from "@/features/dashboard/components/quick-action-card";

export function QuickActionPanel() {
  return (
    <section aria-labelledby="templates-heading" className="space-y-4">
      <h2
        id="templates-heading"
        className="px-1 text-xs font-semibold uppercase tracking-wider text-slate-400"
      >
        Try a template
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {QuickActions.map((action) => (
          <QuickActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            href={action.href}
          />
        ))}
      </div>
    </section>
  );
}