"use client";

import { Address } from "@/types/adress";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import NewAddressDialog from "./NewAddressUser";

interface Props {
  address: Address;
}

export default function AddressCard({ address }: Props) {
  return (
    <div className="border p-4 rounded relative bg-muted/50">
      <div className="mb-1 font-medium">{address.fullName}</div>
      <div className="mb-1">{address.phone}</div>
      <div className="mb-1">
        {address.addressLine}, {address.subDistrict}, {address.district},{" "}
        {address.province}, {address.postalCode}
      </div>

      <div className="absolute top-4 right-4">
        <NewAddressDialog initialData={address} isEditMode>
          <Button
            className="border border-primary cursor-pointer"
            size="icon"
            variant="ghost"
          >
            <Pencil className="w-4 h-4 " />
          </Button>
        </NewAddressDialog>
      </div>
    </div>
  );
}
