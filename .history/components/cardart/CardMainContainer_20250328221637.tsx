import CardBestSeller from "./CardBestSeller";
import CardTrending from "./CardTrending";
import FilterCategories from "./FilterCategories";

const CardMainContainer = () => {
  return (
    <>
      <FilterCategories />
      <h1 className="text-2xl font-semibold mb-4">TRENDING</h1>
      <section className="grid grid-cols-4 w-full gap-6">
        <CardTrending />
        <h1 className="text-2xl font-semibold mb-4">TRENDING</h1>
      </section>
      <CardBestSeller />
    </>
  );
};
export default CardMainContainer;
