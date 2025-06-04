import { ArtistProfile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface ArtistProps {
  artist: ArtistProfile[];
}

const CommuMainContainer = ({ artist }: ArtistProps) => {
  const wallpapper1 = "/images/wallpapper/wallpapper-1.png";
  const wallpapper2 = "/images/wallpapper/wallpapper-2.png";

  return (
    <section className="max-w-[900px] mt-14 mx-auto">
      {/* Header */}
      <div className="flex justify-between text-xl">
        <p>
          Yinka
          <br />
          Shonibare
        </p>
        <p>
          Petrit
          <br />
          Halilaj
        </p>
        <p>
          Rachel
          <br />
          Jones
        </p>
        <p>
          Frank
          <br />
          Bowling
        </p>
      </div>

      <h1 className="title-text mt-36">COMMU</h1>

      <div className="relative flex justify-center mt-4 w-full mx-auto">
        <Image
          className="w-[60%] object-cover"
          src={wallpapper1}
          alt="bg-1"
          width={500}
          height={500}
        />
        <div className="absolute top-[40%] w-full flex justify-center">
          <Image
            className="w-[80%] h-[400px] object-cover"
            src={wallpapper2}
            alt="bg-2"
            width={500}
            height={500}
          />
        </div>
      </div>

      {/* JOIN WITH US */}
      <div className="mt-80 mb-40">
        <h1 className="text-center text-4xl mb-10">JOIN WITH US</h1>
        <div className="grid grid-cols-3 w-full gap-10">
          {artist.map((a) => (
            <div key={a.id} className="bg-black h-40 relative overflow-hidden">
              {/* avatar ซ้าย */}
              <Image
                className="w-[20%] h-full absolute top-0 left-0 object-cover"
                src={a.avatar || "/images/default-avatar.png"}
                alt={a.name}
                height={200}
                width={200}
              />

              {/* center */}
              <div className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                <p className="text-2xl font-semibold">{a.name}</p>
                <p className="text-sm">{a.bio || "No bio yet."}</p>
                <Link href={`/community/${a.id}`}>
                  <button className="mt-3 py-0.5 px-3 button-custom">
                    JOIN
                  </button>
                </Link>
              </div>

              {/* avatar ขวา (ซ้ำหรือ placeholder ได้) */}
              <Image
                className="w-[20%] h-full absolute top-0 right-0 object-cover opacity-40"
                src={a.avatar || "/images/default-avatar.png"}
                alt={a.name}
                height={200}
                width={200}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommuMainContainer;
