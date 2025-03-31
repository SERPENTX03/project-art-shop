import CardBestSeller from "./CardBestSeller";
import CardTrending from "./CardTrending";
import FilterCategories from "./FilterCategories";

type Props = {
  searchParams: {
    category?: string;
    search?: string;
  };
};

const CardMainContainer = ({ searchParams = {} }: Props) => {
  const category = searchParams.category || "ALL";
  const search = searchParams.search || "";

  return (
    <>
      <FilterCategories selected={category} />

      <h1 className="text-2xl font-semibold mb-4">TRENDING</h1>
      <section className="w-full">
        <CardTrending category={category} search={search} />
      </section>

      <h1 className="text-2xl font-semibold mb-4 mt-24">BEST SELLER</h1>
      <section className="grid sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 w-full gap-6">
        <CardBestSeller />
      </section>
    </>
  );
};

export default CardMainContainer;
