import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { CareerProfileService } from "@/server/services/career-profile.service";
import { SkillService } from "@/server/services/skill.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { User } from "lucide-react";

export default async function CareerProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard.profile");
  const enumsT = await getTranslations("enums");
  const common = await getTranslations("common");
  const session = await auth();
  const profile = await CareerProfileService.getByUserId(session!.user!.id);
  const skills = await SkillService.getUserSkills(session!.user!.id);

  if (!profile) {
    return (
      <EmptyState
        icon={User}
        title={t("empty.title")}
        description={t("empty.description")}
        actionLabel={t("empty.action")}
        actionHref="/onboarding"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button asChild variant="outline">
          <Link href="/career-profile/edit">{t("editProfile")}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{profile.fullName ?? common("defaults.unnamed")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">{t("fields.title")}</span> {profile.currentTitle ?? common("emptyPlaceholder")}</p>
          <p><span className="text-muted-foreground">{t("fields.location")}</span> {profile.location ?? common("emptyPlaceholder")}</p>
          <p>
            <span className="text-muted-foreground">{t("fields.targetRoles")}</span>{" "}
            {profile.targetRoles.join(", ") || common("emptyPlaceholder")}
          </p>
          {profile.aiSummary && (
            <p className="mt-4 rounded bg-muted p-3">{profile.aiSummary}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("skillsCount", { count: skills.length })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((us) => (
              <Badge key={us.id} variant="secondary">
                {us.skill.name} · {enumsT(`skillLevel.${us.level}`)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {profile.experiences.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("workExperience")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.experiences.map((exp) => (
              <div key={exp.id} className="border-b pb-4 last:border-0">
                <p className="font-medium">{t("experienceLine", { jobTitle: exp.jobTitle, companyName: exp.companyName })}</p>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
