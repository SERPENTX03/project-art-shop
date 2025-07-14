import { AlertCircle } from "lucide-react";
interface GalleryProps {
  title: string;
  price: number;
  description: string | null;
  quantity: number;
  imageSize: string;
}

const FetchGalleryById = ({
  title,
  price,
  description,
  quantity,
  imageSize,
}: GalleryProps) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        {quantity === 0 ? (
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <AlertCircle className="w-5 h-5" />
            Sorry for the out-of-stock.
          </div>
        ) : (
          <p>Product quantity: {quantity}</p>
        )}
      </div>
      <p className="mt-4 text-3xl text-blue-500 font-semibold">{price}฿</p>
      <div className="w-full max-w-[440px]">
        <p className="text-md text-muted-foreground break-words">
          {description}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Image size: {imageSize}
      </p>
    </div>
  );
};
export default FetchGalleryById;
