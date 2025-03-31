import CardMainContainer from "@/components/cardgalleries/CardMainContainer";
import Hero from "@/components/hero/Hero";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { category?: string; search?: string };
}) {
  const parms = await searchParams;
  const category = parms?.category || "ALL";

  const search = parms?.search || "";

  return (
    <div>
      <Hero />
      <CardMainContainer searchParams={{ category, search }} />
    </div>
  );
}
