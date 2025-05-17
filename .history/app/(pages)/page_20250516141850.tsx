import getRole from "@/actions/checkrole";
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

  const user = await getRole();
  const role = user?.role;

  return (
    <div>
      <Hero role={role} />
      <CardMainContainer searchParams={{ category, search }} />
    </div>
  );
}
