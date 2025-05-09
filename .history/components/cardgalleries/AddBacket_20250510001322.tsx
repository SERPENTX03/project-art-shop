import { SlBasket } from "react-icons/sl";

const AddBacket = ({ itemCount = 0 }) => {
  return (
    <div className="absolute top-2 right-2 group">
      <button className="p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all duration-300 hover:scale-110">
        <div className="relative">
          <SlBasket
            size={30}
            className="text-gray-700 group-hover:text-primary transition-colors"
          />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center transform group-hover:scale-125 transition-transform">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default AddBacket;
