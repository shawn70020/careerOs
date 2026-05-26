import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { InterviewService } from "@/server/services/interview.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("interview");
  const common = await getTranslations("common");
  const session = await auth();
  const logs = await InterviewService.list(session!.user!.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/interview/logs/new">{t("recordFeedback")}</Link>
        </Button>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={t("empty.title")}
          description={t("empty.description")}
          actionLabel={t("empty.action")}
          actionHref="/interview/logs/new"
        />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Link key={log.id} href={`/interview/logs/${log.id}`}>
              <Card className="hover:border-primary/40">
                <CardContent className="py-4">
                  <p className="font-medium">{log.companyName}</p>
                  <p className="text-sm text-muted-foreground">
                    {log.jobTitle ?? common("emptyPlaceholder")} · {formatDate(log.interviewDate, locale)}
                  </p>
                  {log.aiSummary && (
                    <p className="mt-2 text-sm line-clamp-2">{log.aiSummary}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
