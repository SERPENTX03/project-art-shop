import Image from "next/image";

const HeroBg = () => {
  const line1 = "/images/hero/Line-5.png";
  const line2 = "/images/hero/Line-2.png";
  const line3 = "/images/hero/Line-3.png";
  const SubtractRight = "/images/hero/Subtract-right-5.png";
  const Subtractleft = "/images/hero/Subtract-left.png";
  const img1 = "/images/hero/img-1.png";
  const img2 = "/images/hero/img-2.png";
  return (
    <section className="relative border mt-36">
      <Image src={SubtractRight} alt="Sub-right" width={100} height={100} />
    </section>
  );
};
export default HeroBg;
