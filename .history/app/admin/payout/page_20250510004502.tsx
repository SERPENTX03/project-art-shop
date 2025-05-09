import { fetchSoldGalleriesWithShop } from "@/actions/payout";
import AdminSoldGallery from "@/components/admin/AdminSoldGallery";

export default async function AdminSalesPage() {
  const galleries = await fetchSoldGalleriesWithShop();
  console.log(galleries);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6">สินค้าที่ขายแล้ว</h1>
      <AdminSoldGallery galleries={galleries} />
    </div>
  );
}
