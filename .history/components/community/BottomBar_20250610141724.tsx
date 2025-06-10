import { IoIosArrowUp } from "react-icons/io";

const BottomBar = () => {
  return (
    <div className="cursor-pointer fixed bottom-0 left-0 w-full h-[80px] bg-zinc-700 rounded-t-4xl  opacity-100 z-50">
      <div className="flex flex-col justify-center items-center h-full">
        <IoIosArrowUp size={24} className="text-white" />
        <p className=" text-white">
          Your vote means a lot to me—please support me!
        </p>
      </div>
    </div>
  );
};
export default BottomBar;
