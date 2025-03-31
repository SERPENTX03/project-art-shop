import Image from "next/image";

const HeroBg = () => {
  const line1 = "/images/hero/Line-5.png";
  const line2 = "/images/hero/Line-2.png";
  const line3 = "/images/hero/Line-3.png";
  const SubtractRight = "/images/hero/Subtract-right.png";
  const Subtractleft = "/images/hero/Subtract-left.png";
  const img1 = "/images/hero/img-1.png";
  const img2 = "/images/hero/img-2.png";
  return (
    <section className="flex mt-36">
      <Image src={Subtractleft} alt="Sub-Left" width={100} height={100} />
      <Image className="" src={img1} alt="img-1" width={250} height={250} />
      <Image src={SubtractRight} alt="Sub-right" width={100} height={100} />
      <Image src={Subtractleft} alt="Sub-Left" width={100} height={100} />
      <Image src={img2} alt="img-2" width={250} height={250} />
      <div className="h-50 w-50 bg-white "></div>
    </section>
  );
};
export default HeroBg;
