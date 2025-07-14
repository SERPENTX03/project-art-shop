import { fetchAllGalleries, fetchGalleriesByCategory } from "@/actions/gallery";
import SlideTrending from "./SlideTrending";

type CardTrendingProps = {
  category?: string;
  search?: string;
  userId: string | null;
};

const CardTrending = async ({
  category,
  search,
  userId,
}: CardTrendingProps) => {
  const galleries =
    category && category !== "ALL"
      ? await fetchGalleriesByCategory(category)
      : await fetchAllGalleries();

  let filtered = galleries?.filter((g) => g.quantity > 0);

  if (search) {
    const query = search.toLowerCase();
    filtered = filtered?.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        g.description?.toLowerCase().includes(query)
    );
  }

  return <SlideTrending userId={userId} galleries={filtered || []} />;
};
export default CardTrending;
