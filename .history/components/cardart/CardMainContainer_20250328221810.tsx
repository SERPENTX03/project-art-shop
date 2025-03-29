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
      </section>
      <h1 className="text-2xl font-semibold mb-4 mt-24">BEST SELLER</h1>
      <section className="grid grid-cols-4 w-full gap-6">
        <CardBestSeller />
      </section>
    </>
  );
};
export default CardMainContainer;
