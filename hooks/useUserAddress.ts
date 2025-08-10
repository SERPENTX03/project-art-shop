import { useEffect, useState } from "react";
import { getUserAddresses } from "@/actions/address";

export function useUserAddress() {
  const [buyerProvince, setBuyerProvince] = useState("");

  useEffect(() => {
    getUserAddresses().then((res) => {
      if (res.success && res.addresses.length > 0) {
        const defaultAddress = res.addresses[0]; // isDefault = true เรียงอยู่แล้ว
        setBuyerProvince(defaultAddress.province);
      }
    });
  }, []);

  return { buyerProvince };
}
