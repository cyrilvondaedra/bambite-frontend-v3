import NewsDetail from "@/components/NewsDetail";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <NewsDetail slug={slug} />;
}
