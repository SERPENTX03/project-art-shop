import { SlBasket } from "react-icons/sl";

const BasketOrder = () => {
  return (
    <button>
      <p className="relative">
        <SlBasket size={25} />
        <span className="absolute top-0 right-0">0</span>
      </p>
    </button>
  );
};
export default BasketOrder;
