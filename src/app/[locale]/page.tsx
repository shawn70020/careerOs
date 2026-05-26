import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { FileText, Target, GraduationCap } from "lucide-react";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const nav = await getTranslations("nav");
  const common = await getTranslations("common");

  const features = [
    {
      icon: FileText,
      title: t("features.resumeIntelligence.title"),
      desc: t("features.resumeIntelligence.description"),
    },
    {
      icon: Target,
      title: t("features.jobFitAnalysis.title"),
      desc: t("features.jobFitAnalysis.description"),
    },
    {
      icon: GraduationCap,
      title: t("features.skillGrowthRoadmap.title"),
      desc: t("features.skillGrowthRoadmap.description"),
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <span className="text-xl font-bold text-primary">{common("appName")}</span>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Button variant="ghost" asChild>
              <Link href="/login">{nav("signIn")}</Link>
            </Button>
            <Button asChild>
              <Link href="/register">{nav("signUp")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("heroTitle")}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{t("heroDescription")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/demo">{nav("publicDemo")}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/register">{common("actions.getStarted")}</Link>
          </Button>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 px-6 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border bg-card p-6 text-center sm:text-left">
              <f.icon className="mx-auto h-8 w-8 text-primary sm:mx-0" />
              <h2 className="mt-4 font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-muted-foreground">{t("footer")}</footer>
    </div>
  );
}
