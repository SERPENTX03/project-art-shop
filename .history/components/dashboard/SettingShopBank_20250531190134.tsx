"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Settings } from "lucide-react";
import { ShopProps } from "@/types/shop";
import { toast } from "react-toastify";
import { updateArtistBankInfo } from "@/actions/artist";

interface ShopInterface {
  artist: ShopProps | null;
}

const SettingShopBank = ({ artist }: ShopInterface) => {
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());

  const toggleEditField = (field: string) => {
    setEditingFields((prev) => {
      const updated = new Set(prev);
      if (updated.has(field)) {
        updated.delete(field);
      } else {
        updated.add(field);
      }
      return updated;
    });
  };

  const clientAction = async (formData: FormData) => {
    await updateArtistBankInfo(formData);
    toast.success("อัปเดตข้อมูลบัญชีเรียบร้อยแล้ว");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="button-custom px-4 flex items-center py-2">
          Setting Payment <Settings className="ml-2 w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ข้อมูลบัญชีธนาคาร</DialogTitle>
          <DialogDescription>
            แก้ไขบัญชีธนาคารของร้านคุณได้ที่นี่
          </DialogDescription>
        </DialogHeader>

        <form action={clientAction} className="space-y-4">
          {/* Bank Name */}
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Label>ชื่อธนาคาร</Label>
              <Input
                name="bankName"
                defaultValue={artist?.bankName || ""}
                readOnly={!editingFields.has("bankName")}
                className={!editingFields.has("bankName") ? "bg-gray-100" : ""}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleEditField("bankName")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          {/* Account Name */}
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Label>ชื่อบัญชี</Label>
              <Input
                name="accountName"
                defaultValue={artist?.accountName || ""}
                readOnly={!editingFields.has("accountName")}
                className={
                  !editingFields.has("accountName") ? "bg-gray-100" : ""
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleEditField("accountName")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          {/* Account Number */}
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Label>เลขบัญชี</Label>
              <Input
                name="accountNumber"
                defaultValue={artist?.accountNumber || ""}
                readOnly={!editingFields.has("accountNumber")}
                className={
                  !editingFields.has("accountNumber") ? "bg-gray-100" : ""
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleEditField("accountNumber")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          {/* PromptPay ID */}
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Label>PromptPay (ถ้ามี)</Label>
              <Input
                name="promptpayId"
                defaultValue={artist?.promptpayId || ""}
                readOnly={!editingFields.has("promptpayId")}
                className={
                  !editingFields.has("promptpayId") ? "bg-gray-100" : ""
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleEditField("promptpayId")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          {/* Submit Button */}
          <Button type="submit">บันทึกการเปลี่ยนแปลง</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingShopBank;
