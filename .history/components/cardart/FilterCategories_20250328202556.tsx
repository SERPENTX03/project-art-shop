import { SlArrowDown } from "react-icons/sl";

const FilterCategories = () => {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap justify-center gap-6 py-4">
        <button className="flex items-center button-custom py-2  px-6">
          <span>ALL</span>
          <SlArrowDown size={15} />
        </button>
        <button className="button-custom py-2  px-6">DIGITAL ART</button>
        <button className="button-custom py-2  px-6">DRAWINGS</button>
        <button className="button-custom py-2 px-6">PHOTOGRAPHY</button>
      </div>
    </section>
  );
};
export default FilterCategories;
