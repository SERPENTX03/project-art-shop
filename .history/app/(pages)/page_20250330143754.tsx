import CardMainContainer from "@/components/cardgalleries/CardMainContainer";
import Hero from "@/components/Hero";

export default function HomePage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const category = searchParams?.category || "ALL";

  return (
    <div>
      <Hero />
      <CardMainContainer searchParams={{ category }} />
    </div>
  );
}
