import { CommuData } from "@/utils/DataCommu";
import Image from "next/image";

const CommuMainContainer = () => {
  const wallpapper1 = "/images/wallpapper/wallpapper-1.png";
  const wallpapper2 = "/images/wallpapper/wallpapper-2.png";

  return (
    <section className="max-w-[900px] mt-14 mx-auto ">
      {/* Header Title */}
      <div className="flex justify-between text-xl">
        <p>
          Yinka <br />
          Shonibare
        </p>
        <p>
          Petrit <br />
          Halilaj
        </p>
        <p>
          Rachel <br />
          Jones
        </p>
        <p>
          Frank <br />
          Bowling
        </p>
      </div>

      <h1 className="title-text mt-36">COMMU</h1>
      <div className="relative flex justify-center mt-4 w-full mx-auto">
        {/* Wallpaper 1 */}
        <Image
          className="w-[60%] "
          src={wallpapper1}
          alt="bg-1"
          width={500}
          height={500}
          objectFit="cover"
        />

        {/* Wallpaper 2 (ขยับขึ้นมาทับ Wallpaper 1) */}
        <div className="absolute top-[40%] w-full flex justify-center">
          <Image
            className="w-[80%] h-[400px]"
            src={wallpapper2}
            alt="bg-2"
            width={500}
            height={500}
            objectFit="cover"
          />
        </div>
      </div>

      {/* Grid Layout */}
      {/* เดี่ยวกลับมาเอา MB-40 ออก */}
      <div className="mt-80 mb-40">
        <h1 className="text-center text-4xl mb-10">JOIN WITH US</h1>
        <div className="grid grid-cols-3 w-full gap-10">
          {CommuData.map((commu, index) => {
            return (
              <div key={index} className="bg-black h-40 relative">
                {/* Image Lift */}
                {commu.ImageL && typeof commu.ImageL === "string" && (
                  <Image
                    className="w-[20%] h-full absolute top-0 left-0"
                    src={commu.ImageL}
                    alt={commu.title}
                    height={200}
                    width={200}
                  />
                )}

                <div className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground">
                  <p className="text-4xl mb-2">{commu.price}</p>
                  <p className="text">{commu.title}</p>
                  <button className="bg-foreground font-semibold text-primary mt-3 py-0.5 px-3 rounded-4xl">
                    JOIN
                  </button>
                </div>

                {/* Image Right */}
                {commu.ImageR && typeof commu.ImageR === "string" && (
                  <Image
                    className="w-[20%] h-full absolute top-0 right-0"
                    src={commu.ImageR}
                    alt={commu.title}
                    height={200}
                    width={200}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default CommuMainContainer;
