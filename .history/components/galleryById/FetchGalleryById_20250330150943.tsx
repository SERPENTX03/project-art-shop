interface GalleryProps {
  title: string;
  price: number;
  description: string | null;
  quantity: number;
}

const FetchGalleryById = ({
  title,
  price,
  description,
  quantity,
}: GalleryProps) => {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p>{quantity}</p>
      </div>
      <p className="mt-4 text-3xl text-blue-500 font-semibold">{price}฿</p>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
};
export default FetchGalleryById;
