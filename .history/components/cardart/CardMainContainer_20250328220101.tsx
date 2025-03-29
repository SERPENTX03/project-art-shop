import CardBestSeller from "./CardBestSeller";
import CardTrending from "./CardTrending";
import FilterCategories from "./FilterCategories";

const CardMainContainer = () => {
  return (
    <>
      <FilterCategories />
      <section className="grid grid-cols-4 w-full gap-6">
        <h1 className="text-2xl font-semibold">TRENDING</h1>
        <CardTrending />
      </section>
      <CardBestSeller />
    </>
  );
};
export default CardMainContainer;
