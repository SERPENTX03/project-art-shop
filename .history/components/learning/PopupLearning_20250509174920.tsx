import { SlClose } from "react-icons/sl";

const PopupLearning = () => {
  return (
    <div className="fixed left-0 top-0 w-full bg-black/10 h-screen z-50">
      <div className="relative max-w-[800px] rounded-2xl mx-auto mt-40 bg-white p-8"></div>
      <button>
        <SlClose />
      </button>
    </div>
  );
};
export default PopupLearning;
