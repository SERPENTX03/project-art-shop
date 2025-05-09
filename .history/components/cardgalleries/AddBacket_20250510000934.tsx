import { SlBasket } from "react-icons/sl";

const AddBacket = () => {
  return (
    <div className="absolute top-2 right-2">
      <SlBasket size={30} />
      <span className="text-3xl font-bold">+</span>
    </div>
  );
};
export default AddBacket;
