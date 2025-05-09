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
    <div className="fixed left-0 top-0 w-full bg-black/10 h-screen z-50 px-6">
      <div className="relative max-w-[1000px] rounded-2xl mx-auto mt-20 bg-white p-8">
        {/* Close */}
        <button
          onClick={() => setModel(false)}
          className="absolute top-4 right-4"
        >
          <SlClose size={25} />
        </button>

        {/* Modal Content */}
        {/* Content */}
        {/* Content 2 คอลัมน์ */}
        <div className="flex flex-col md:flex-row gap-6  rounded-lg p-4">
          {/* รูปภาพ */}
          <Image
            className="rounded  object-cover"
            src={data.img}
            alt={data.details.slice(0, 20)}
            width={300}
            height={300}
          />

          {/* ข้อความ */}
          <div className="text-sm whitespace-pre-line leading-6">
            {data.details}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupLearning;
