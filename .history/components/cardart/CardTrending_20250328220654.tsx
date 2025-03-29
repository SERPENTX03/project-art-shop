import { fetchAllGalleries } from "@/actions/gallery";
import Image from "next/image";

const CardTrending = async () => {
  const galleries = await fetchAllGalleries();

  return (
    <>
      {galleries.slice(0, 4).map((art, index) => (
        <div key={index}>
          <h2>{art.title}</h2>
          <div className="image-grid">
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
        </div>
      ))}
    </>
  );
};
export default CardTrending;
