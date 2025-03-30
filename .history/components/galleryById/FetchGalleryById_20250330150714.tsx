interface GalleryProps {
  title: string;
  price: number;
  description: string | null;
}

const FetchGalleryById = ({ title, price, description }: GalleryProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-4 text-3xl text-blue-500 font-semibold">{price}฿</p>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
};
export default FetchGalleryById;
