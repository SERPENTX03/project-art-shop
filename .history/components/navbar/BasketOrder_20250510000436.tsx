import { SlBasket } from "react-icons/sl";

const BasketOrder = () => {
  return (
    <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
      <SlBasket size={25} className="text-gray-700" />

      <span className="absolute -top-1 -right-1 bg-red-500 h-5 w-5 rounded-full text-white flex items-center justify-center text-xs font-medium">
        0
      </span>
    </button>
  );
};
export default BasketOrder;
