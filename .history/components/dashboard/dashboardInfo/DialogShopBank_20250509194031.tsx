"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateShopBankInfo } from "@/actions/shop";
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

interface ShopInterface {
  shop: ShopProps | null;
}

const DialogShopBank = ({ shop }: ShopInterface) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(formRef.current!);
    const res = await updateShopBankInfo(formData);

    if (res.success) {
      toast.success(res.message || "อัปเดตสำเร็จ");
      setEditingField(null);
    } else {
      toast.error(res.message || "เกิดข้อผิดพลาด");
    }
  };

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

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="ชื่อธนาคาร"
            name="bankName"
            value={shop?.bankName || ""}
            editingField={editingField}
            setEditingField={setEditingField}
          />
          <Field
            label="ชื่อบัญชี"
            name="accountName"
            value={shop?.accountName || ""}
            editingField={editingField}
            setEditingField={setEditingField}
          />
          <Field
            label="เลขบัญชี"
            name="accountNumber"
            value={shop?.accountNumber || ""}
            editingField={editingField}
            setEditingField={setEditingField}
          />
          <Field
            label="PromptPay (ถ้ามี)"
            name="promptpayId"
            value={shop?.promptpayId || ""}
            editingField={editingField}
            setEditingField={setEditingField}
          />

          <Button type="submit">บันทึกการเปลี่ยนแปลง</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({
  label,
  name,
  value,
  editingField,
  setEditingField,
}: {
  label: string;
  name: string;
  value: string;
  editingField: string | null;
  setEditingField: (field: string) => void;
}) => (
  <div className="flex items-center gap-2">
    <div className="w-full">
      <Label>{label}</Label>
      <Input
        name={name}
        defaultValue={value}
        disabled={editingField !== name}
      />
    </div>
    <Button type="button" variant="ghost" onClick={() => setEditingField(name)}>
      <Pencil className="w-4 h-4" />
    </Button>
  </div>
);

export default DialogShopBank;
