import { auth } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { fetchGalleryByUserId } from "@/actions/gallery";
import { fetchShopInfoByUserId } from "@/actions/artist";
import { fetchPayoutByUserId } from "@/actions/payout";

import PayoutSummary from "@/components/dashboard/dashboardInfo/PayoutSummary";
import { fetchOrderByShop } from "@/actions/order";
import StatusShop from "@/components/dashboard/dashboardInfo/StatusShop";
import { redirect } from "next/navigation";
// import DashboardInfo from "@/components/dashboard/dashboardInfo/DashboardInfo";

const ShopDashboard = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const galleries = await fetchGalleryByUserId(userId);
  const artist = await fetchShopInfoByUserId(userId);
  const payouts = await fetchPayoutByUserId(userId);
  const orders = await fetchOrderByShop(userId);

  if (!artist) {
    redirect("/createshop");
  }

  return (
    <div className="py-10 px-6 space-y-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">🏪 Hello, Artist {artist?.name}</h1>
      <Separator />

      {/* <DashboardInfo /> */}
      <div>
        <h3 className="mb-2 text-2xl font-semibold">Status</h3>
        <StatusShop galleries={galleries} orders={orders} />
      </div>

      <PayoutSummary payouts={payouts} shop={artist} orders={orders} />
    </div>
  );
};

export default ShopDashboard;
