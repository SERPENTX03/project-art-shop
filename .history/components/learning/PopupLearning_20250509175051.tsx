import { SlClose } from "react-icons/sl";

const PopupLearning = ({ setModel }) => {
  return (
    <div className="fixed left-0 top-0 w-full bg-black/10 h-screen z-50">
      <div className="relative max-w-[800px] rounded-2xl mx-auto mt-40 bg-white p-8">
        {/* Close */}
        <button
          onClick={() => setModel(false)}
          className="absolute top-4 right-4"
        >
          <SlClose size={25} />
        </button>
      </div>
    </div>
  );
};
export default PopupLearning;
