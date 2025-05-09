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
    <div className="fixed left-0 top-0 w-full h-screen bg-black/10 z-50">
      <div className="relative max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl mx-auto mt-20 bg-white p-6 shadow-lg">
        {/* ปุ่มปิด */}
        <button
          onClick={() => setModel(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <SlClose size={24} />
        </button>

        {/* รูปภาพ + ข้อความ */}
        <div className="flex flex-col items-center">
          {/* รูปภาพ */}
          <Image
            className="rounded-md mb-4 object-cover w-full h-auto"
            src={data.img}
            alt={data.details.slice(0, 20)}
            width={500}
            height={500}
          />

          {/* ข้อความ */}
          <div className="text-sm whitespace-pre-line leading-relaxed text-gray-800 w-full">
            {data.details}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupLearning;
