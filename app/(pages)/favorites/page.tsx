import { getMyFavorites } from "@/actions/favorite";
import Image from "next/image";
import Link from "next/link";

export default async function FavoritesPage() {
  const favorites = await getMyFavorites();
  if (!favorites) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        My Favorite
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">คุณยังไม่มีรายการที่ถูกใจ</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <Link
              key={item.id}
              href={`/gallery/${item.id}`}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col"
            >
              <div className="relative w-full h-48 mb-3 overflow-hidden rounded-md">
                <Image
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                {item.description}
              </p>
              <div className="text-primary font-bold text-right">
                ฿{item.price.toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
