import CardBestSeller from "./CardBestSeller";
import CardTrending from "./CardTrending";
import FilterCategories from "./FilterCategories";

const CardMainContainer = () => {
  return (
    <>
      <FilterCategories />
      <CardTrending />
      <CardBestSeller />
    </>
  );
};
export default CardMainContainer;
