import { auth } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { fetchGalleryByUserId } from "@/actions/gallery";
import { fetchShopInfoByUserId } from "@/actions/shop";
import InfoDashboard from "@/components/dashboard/dashboardInfo/Info";
import GallerySummary from "@/components/dashboard/dashboardInfo/GallerySummary";
import GalleryList from "@/components/dashboard/dashboardInfo/GalleryList";

const ShopDashboard = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const galleries = await fetchGalleryByUserId(userId);
  const shop = await fetchShopInfoByUserId(userId);

  const totalGallery = galleries.length;
  const totalSold = galleries.reduce((sum, g) => sum + g.soldCount, 0);
  const totalStock = galleries.reduce((sum, g) => sum + g.quantity, 0);

  return (
    <div className="py-10 px-6 space-y-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">🏪 Your Shop Dashboard</h1>
      <Separator />
      <InfoDashboard shop={shop} totalGallery={totalGallery} />

      <GallerySummary
        totalStock={totalStock}
        totalSold={totalSold}
        galleries={galleries}
      />

      <GalleryList galleries={galleries} />
    </div>
  );
};

export default ShopDashboard;
