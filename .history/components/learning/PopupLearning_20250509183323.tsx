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
      <div className="relative max-w-[1000px]  rounded-2xl mx-auto  bg-white p-8">
        {/* Close */}
        <button
          onClick={() => setModel(false)}
          className="absolute top-4 right-4"
        >
          <SlClose size={25} />
        </button>

        {/* Modal Content */}
        {/* Content */}
        <div className="border">
          <Image
            className=" object-cover rounded"
            src={data.img}
            alt={data.details.slice(0, 10)}
            width={400}
            height={400}
          />
          <p className=" text-sm whitespace-pre-line mt-4">
            {data.details.slice(0, 29)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopupLearning;
