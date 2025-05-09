import { SlBasket } from "react-icons/sl";

const BasketOrder = () => {
  return (
    <button className="relative">
      <p>0</p>
      <p>
        <SlBasket size={25} />
      </p>
    </button>
  );
};
export default BasketOrder;
