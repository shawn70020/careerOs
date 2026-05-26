import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

/** MVP: no full knowledge base — notes live on learning roadmap tasks */
export default async function KnowledgeBaseRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/${locale}/learning`);
}
