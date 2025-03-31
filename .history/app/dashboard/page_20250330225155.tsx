import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { fetchGalleryById } from "@/actions/gallery";
import { fetchShopInfoByUserId } from "@/actions/shop";

const ShopDashboard = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const galleries = await fetchGalleryById(userId);
  const shop = await fetchShopInfoByUserId(userId);

  const totalGallery = galleries.length;
  const totalSold = galleries.reduce((sum, g) => sum + g.soldCount, 0);
  const totalStock = galleries.reduce((sum, g) => sum + g.quantity, 0);

  return (
    <div className="py-10 px-6 space-y-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">🏪 Your Shop Dashboard</h1>
      <Separator />

      {/* Shop Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Shop Name</p>
            <h2 className="text-xl font-bold">
              {shop?.name || "Unnamed Shop"}
            </h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <h2 className="text-xl font-bold">{shop?.phone || "N/A"}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Galleries</p>
            <h2 className="text-xl font-bold">{totalGallery}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Gallery Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Total Items in Stock
            </p>
            <h2 className="text-xl font-bold text-green-600">{totalStock}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Sold</p>
            <h2 className="text-xl font-bold text-blue-500">{totalSold}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Approvals</p>
            <h2 className="text-xl font-bold text-yellow-600">
              {galleries.filter((g) => g.status === "PENDING").length}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Gallery List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold mt-10">🖼️ Your Galleries</h2>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Card key={gallery.id}>
              <CardContent className="p-4">
                <Image
                  src={gallery.images[0]}
                  alt={gallery.title}
                  width={500}
                  height={300}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-md font-bold mt-2">{gallery.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {gallery.description}
                </p>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span>💰 {gallery.price}฿</span>
                  <span>📦 {gallery.quantity} in stock</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sold: {gallery.soldCount} | Status: {gallery.status}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
