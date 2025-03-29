import { fetchAllGalleries } from "@/actions/gallery";
import Image from "next/image";

const CardTrending = async () => {
  const galleries = await fetchAllGalleries();

  return (
    <>
      {galleries.map((art, index) => {
        console.log(`Gallery ${index + 1}:`, art.images.slice(0, 4)); // เช็กว่าตัดเหลือ 4 ไหม

        return (
          <div key={index}>
            {art.images.slice(0, 4).map((img, imgIndex) => (
              <Image
                key={imgIndex}
                src={img}
                alt={art.title}
                width={200}
                height={200}
              />
            ))}
          </div>
        );
      })}
    </>
  );
};
export default CardTrending;
