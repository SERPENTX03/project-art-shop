import Image from "next/image";
import { SlClose } from "react-icons/sl";

interface PopupLearningProps {
  setModel: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    img: string;
    description: string;
    widthImage: string;
    widthDescription: string;
    lineHeight: string;
    details: string;
  };
}

const PopupLearning = ({ setModel, data }: PopupLearningProps) => {
  return (
    <div className="fixed left-0 top-0 w-full bg-black/10  h-screen z-50 px-6 ">
      <div className="relative max-w-[1000px] mt-20 rounded-2xl mx-auto  bg-white p-8">
        {/* Close */}
        <button
          onClick={() => setModel(false)}
          className="cursor-pointer absolute top-4 right-4"
        >
          <SlClose size={25} />
        </button>

        {/* Modal Content */}
        {/* Content */}
        <div className="p-4">
          <Image
            className="float-left object-cover rounded mr-4 "
            src={data.img}
            alt={data.details.slice(0, 10)}
            width={250}
            height={250}
          />
          <p className="text-sm whitespace-break-spaces">{data.details}</p>
        </div>
      </div>
    </div>
  );
};

export default PopupLearning;
