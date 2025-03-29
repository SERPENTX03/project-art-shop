import { fetchAllGalleries } from "@/actions/gallery";

const CardBestSeller = async () => {
  const galleries = await fetchAllGalleries();
  console.log(galleries);
  return (
    <section>
      <h1 className="text-2xl font-semibold">CardBestSeller</h1>
      <p className="text-red-500">รอดึงจากฐานข้อมูล</p>
    </section>
  );
};
export default CardBestSeller;
