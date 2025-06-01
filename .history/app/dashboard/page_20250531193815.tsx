import { auth } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { fetchGalleryByUserId } from "@/actions/gallery";
import { fetchPayoutByUserId } from "@/actions/payout";

import { fetchOrderByShop } from "@/actions/order";
import StatusShop from "@/components/dashboard/StatusShop";
import { redirect } from "next/navigation";
import PayoutSummary from "@/components/dashboard/PayoutSummary";
import ProfileArtist from "@/components/dashboard/ProfileArtist";
import { fetchArtistInfoByUserId } from "@/actions/artist";
import CommuArtist from "@/components/dashboard/CommuArtist";
// import BioArtist from "@/components/dashboard/BioArtist";

const ArtistDashboard = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const galleries = await fetchGalleryByUserId(userId);
  const artist = await fetchArtistInfoByUserId(userId);
  const payouts = await fetchPayoutByUserId(userId);
  const orders = await fetchOrderByShop(userId);

  if (!artist) {
    redirect("/createshop");
  }

  return (
    <div className="py-10 px-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center">
        <ProfileArtist initialAvatar={artist.avatar ?? null} />
        <h1 className="text-2xl font-bold">🏪 Hello, Artist {artist?.name}</h1>
      </div>
      {/* เผื่อมีในอนาคต */}
      {/* <BioArtist /> */}
      <CommuArtist />

      <Separator />

      {/* <DashboardInfo /> */}
      <div>
        <h3 className="mb-2 text-2xl font-semibold">Status</h3>
        <StatusShop galleries={galleries} orders={orders} />
      </div>

      <PayoutSummary payouts={payouts} artist={artist} orders={orders} />
    </div>
  );
};

export default ArtistDashboard;
