import CardMainContainer from "@/components/cardgalleries/CardMainContainer";
import Hero from "@/components/Hero";

export default function HomePage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const params = searchParams || {};

  return (
    <div>
      <Hero />
      <CardMainContainer searchParams={params} />
    </div>
  );
}
