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
import { updateShopBankInfo } from "@/actions/shop";

interface ShopInterface {
  shop: ShopProps | null;
}

const DialogShopBank = ({ shop }: ShopInterface) => {
  const [editingField, setEditingField] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          จัดการบัญชี <Settings className="ml-2 w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ข้อมูลบัญชีธนาคาร</DialogTitle>
          <DialogDescription>
            แก้ไขบัญชีธนาคารของร้านคุณได้ที่นี่
          </DialogDescription>
        </DialogHeader>

        <form action={updateShopBankInfo} className="space-y-4">
          <input type="hidden" name="userId" value={shop?.id} />

          {/* Bank Name */}
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Label>ชื่อธนาคาร</Label>
              <Input
                name="bankName"
                defaultValue={shop?.bankName || ""}
                disabled={editingField !== "bankName"}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingField("bankName")}
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
                defaultValue={shop?.accountName || ""}
                disabled={editingField !== "accountName"}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingField("accountName")}
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
                defaultValue={shop?.accountNumber || ""}
                disabled={editingField !== "accountNumber"}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingField("accountNumber")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          {/* Promptpay ID */}
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Label>PromptPay (ถ้ามี)</Label>
              <Input
                name="promptpayId"
                defaultValue={shop?.promptpayId || ""}
                disabled={editingField !== "promptpayId"}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingField("promptpayId")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={!editingField}>
            บันทึกการเปลี่ยนแปลง
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogShopBank;
