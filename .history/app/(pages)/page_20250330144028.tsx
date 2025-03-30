import CardMainContainer from "@/components/cardgalleries/CardMainContainer";
import Hero from "@/components/Hero";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const params = await searchParams;
  const category = params?.category || "ALL";

  return (
    <div>
      <Hero />
      <CardMainContainer searchParams={{ category }} />
    </div>
  );
}
