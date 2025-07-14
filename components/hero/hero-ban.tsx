import Image from "next/image";

const HeroBg = () => {
  // const line1 = "/images/hero/Line-5.png";
  // const line2 = "/images/hero/Line-2.png";
  // const line3 = "/images/hero/Line-3.png";
  const SubtractRight = "/images/hero/Subtract-right.png";
  const Subtractleft = "/images/hero/Subtract-left.png";
  const img1 = "/images/hero/img-1.png";
  const img2 = "/images/hero/img-2.png";
  return (
    <section className="flex justify-center mt-36">
      <Image
        className="object-contain"
        src={Subtractleft}
        alt="Sub-Left"
        width={100}
        height={100}
      />
      <Image
        className="object-contain"
        src={img1}
        alt="img-1"
        width={250}
        height={250}
      />
      <Image
        className="object-contain"
        src={SubtractRight}
        alt="Sub-right"
        width={100}
        height={100}
      />
      <Image
        className="object-contain"
        src={Subtractleft}
        alt="Sub-Left"
        width={100}
        height={100}
      />
      <Image
        className="object-contain"
        src={img2}
        alt="img-2"
        priority
        width={250}
        height={250}
      />
      <div className="relative h-44 w-44 rounded-full bg-white -ml-1">
        <div className="absolute inset-0 m-auto h-32 w-32 rounded-full bg-background">
          <div className="flex flex-col w-full h-full items-center justify-center rotate-[20deg]">
            <h1 className="text-3xl font-semibold">15K</h1>
            <p>PEOPLE</p>
          </div>
        </div>
      </div>
      <Image
        className="object-contain -ml-1"
        src={img1}
        alt="img-1"
        width={250}
        height={250}
      />
      <Image
        className="object-contain -ml-2"
        src={Subtractleft}
        alt="Sub-Left"
        width={100}
        height={100}
      />
    </section>
  );
};
export default HeroBg;
