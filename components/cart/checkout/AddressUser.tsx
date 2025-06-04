import { useAddressStore } from "@/store/addressStore";
import { useRouter } from "next/navigation";
import NewAddressDialog from "./NewAddressUser";
import AddressCard from "./AddressCard";

export default function AddressUser() {
  const { address, loading } = useAddressStore();
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh(); // หรือจะ refetch address store ก็ได้
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">ที่อยู่ในการจัดส่ง</h3>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : address ? (
        <AddressCard address={address} />
      ) : (
        <NewAddressDialog onSuccess={handleSuccess} />
      )}
    </div>
  );
}
