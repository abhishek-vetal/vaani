import { QuickActions } from "@/features/dashboard/data/quick-actions";
import { QuickActionCard } from "@/features/dashboard/components/quick-action-card";

export function QuickActionPanel() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-4">
      {
        QuickActions.map(action => (
          <QuickActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            gradient={action.gradient}
            href={action.href}
          />
        ))
      }
    </div>
  )
}