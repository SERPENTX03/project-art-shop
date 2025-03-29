import CardBestSeller from "./CardBestSeller";
import CardTrending from "./CardTrending";
import FilterCategories from "./FilterCategories";

const CardMainContainer = () => {
  return (
    <>
      <FilterCategories />
      <section className="grid grid-cols-3 w-full gap-6">
        <CardTrending />
      </section>
      <CardBestSeller />
    </>
  );
};
export default CardMainContainer;
