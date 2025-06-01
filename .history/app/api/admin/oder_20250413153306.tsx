import { fetchSoldGalleriesWithShop } from "@/actions/order";

const OrderByShop = async () => {
  const soldGalleries = await fetchSoldGalleriesWithShop();
  return (
    <div>
      {soldGalleries.map((gallery) => (
        <div key={gallery.id} className="border p-4 rounded-xl space-y-2">
          <h2 className="font-bold">{gallery.title}</h2>
          <p>ขายไปแล้ว: {gallery.soldCount} ชิ้น</p>
          <p>ราคา: {gallery.price} บาท</p>
          <div className="text-sm text-muted-foreground">
            🏪 ร้าน: {gallery.shop?.name || "ไม่พบข้อมูลร้าน"}
            <br />
            📞 โทร: {gallery.shop?.phone || "-"}
          </div>
        </div>
      ))}
    </div>
  );
};
export default OrderByShop;
