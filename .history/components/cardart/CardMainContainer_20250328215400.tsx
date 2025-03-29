import CardBestSeller from "./CardBestSeller";
import CardTrending from "./CardTrending";
import FilterCategories from "./FilterCategories";

const CardMainContainer = () => {
  return (
    <>
      <FilterCategories />
      <div>
        <CardTrending />
      </div>
      <CardBestSeller />
    </>
  );
};
export default CardMainContainer;
