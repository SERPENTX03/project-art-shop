"use client";

import NewAddressDialog from "./NewAddressUser";
import AddressCard from "./AddressCard";
import { useAddressStore } from "@/store/addressStore";

export default function AddressUser() {
  const { address, loading } = useAddressStore();

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">ที่อยู่ในการจัดส่ง</h3>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : address ? (
        <AddressCard address={address} />
      ) : (
        <NewAddressDialog />
      )}
    </div>
  );
}
