import CardMainContainer from "@/components/cardgalleries/CardMainContainer";
import Hero from "@/components/Hero";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { category?: string; search?: string };
}) {
  const catfilter = await searchParams;
  const category = catfilter?.category || "ALL";

  const search = await searchParams;
  const searchParam = search?.search || "";

  return (
    <div>
      <Hero />
      <CardMainContainer searchParams={{ category }} search={{ searchParam }} />
    </div>
  );
}
