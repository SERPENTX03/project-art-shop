import { SlBasket } from "react-icons/sl";

const BasketOrder = () => {
  return (
    <button className="relative">
      <p>
        <SlBasket size={25} />
        <span></span>
      </p>
    </button>
  );
};
export default BasketOrder;
