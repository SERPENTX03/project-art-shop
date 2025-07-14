import { GoArrowDown } from "react-icons/go";
import HeroBg from "./hero-ban";

const Hero = () => {
  return (
    <div>
      <div className="flex justify-between mt-20">
        {/* Hero */}
        <div className="flex justify-center text-5xl font-medium w-full">
          <div className="leading-20">
            <h1>&quot;Your Art,</h1>
            <h1 className="ml-18">Your Legacy&quot;</h1>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div>
            <h3 className="text-2xl">
              สื่อถึงการสร้างมรดกศิลปะของศิลปิน
              <br />
              และการเก็บสะสมผลงานที่มีคุณค่า
            </h3>
            <button className="button-custom rounded-3xl text-xl font-light py-2.5 px-10 mt-10">
              GALLERY
            </button>
          </div>
        </div>
      </div>
      <HeroBg />
      {/* Scroll to see more */}
      <div className="flex justify-center mt-10">
        <GoArrowDown size={20} />
        <span className="mx-4">Scroll to see more</span>
        <GoArrowDown size={20} />
      </div>
      <div className="border border-slate-500 mt-14 "></div>
    </div>
  );
};
export default Hero;
