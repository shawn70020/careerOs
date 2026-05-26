import { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <Icon className="mb-4 h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && actionHref !== "#" && (
        <Button asChild className="mt-6">
          <Link href={actionHref as "/jobs/new"}>{actionLabel}</Link>
        </Button>
      )}
      {actionLabel && actionHref === "#" && (
        <p className="mt-6 text-sm text-muted-foreground">{actionLabel}</p>
      )}
    </div>
  );
}
