import { SlClose } from "react-icons/sl";

interface PopupLearningProps {
  setModel: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    img: string;
    description: string;
    widthImage: string;
    widthDescription: string;
    lineHeight: string;
  };
}

const PopupLearning = ({ setModel, data }: PopupLearningProps) => {
  return (
    <div className="fixed left-0 top-0 w-full bg-black/10 h-screen z-50">
      <div className="relative px-6 max-w-[1000px] rounded-2xl mx-auto mt-20 bg-white p-8">
        {/* Close */}
        <button
          onClick={() => setModel(false)}
          className="absolute top-4 right-4"
        >
          <SlClose size={25} />
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-bold mb-4">More Details</h2>
        <p className="text-sm whitespace-pre-line">{data.description}</p>
      </div>
    </div>
  );
};

export default PopupLearning;
