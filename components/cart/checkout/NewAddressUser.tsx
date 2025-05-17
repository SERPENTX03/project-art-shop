"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import provinces from "@/data/json/thai_provinces.json";
import amphures from "@/data/json/thai_amphures.json";
import tambons from "@/data/json/thai_tambons.json";
import { Address, Amphure, Province, Tambon } from "@/types/adress";
import { createAddress, updateAddress } from "@/actions/address";
import { toast } from "react-toastify";
import { useTransition } from "react";

interface Props {
  initialData?: Address;
  isEditMode?: boolean;
  children?: React.ReactNode;
}

export default function NewAddressDialog({
  initialData,
  isEditMode,
  children,
}: Props) {
  const [, startTransition] = useTransition();
  const methods = useForm<Address>({
    defaultValues: initialData || {},
  });
  const [step, setStep] = useState("province");

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    provinces.find((p) => p.name_th === initialData?.province) || null
  );
  const [selectedAmphure, setSelectedAmphure] = useState<Amphure | null>(
    amphures.find((a) => a.name_th === initialData?.district) || null
  );
  const [selectedTambon, setSelectedTambon] = useState<Tambon | null>(
    tambons.find((t) => t.name_th === initialData?.subDistrict) || null
  );

  const districts = selectedProvince
    ? amphures.filter((a) => a.province_id === selectedProvince.id)
    : [];
  const subDistricts = selectedAmphure
    ? tambons.filter((t) => t.amphure_id === selectedAmphure.id)
    : [];

  useEffect(() => {
    if (selectedTambon) {
      methods.setValue("postalCode", String(selectedTambon.zip_code));
    }
  }, [selectedTambon, methods]);

  const onSubmit = (data: Address) => {
    startTransition(async () => {
      try {
        const res =
          isEditMode && initialData?.id
            ? await updateAddress(initialData.id, data)
            : await createAddress(data);

        if (res.success) {
          toast.success(
            isEditMode
              ? "อัปเดตที่อยู่เรียบร้อยแล้ว"
              : "เพิ่มที่อยู่เรียบร้อยแล้ว"
          );
          methods.reset();
        } else {
          toast.error(res.error || "เกิดข้อผิดพลาด");
        }
      } catch (e) {
        console.log(e);
        toast.error("เกิดข้อผิดพลาดระหว่างบันทึกที่อยู่");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button>{isEditMode ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <Input
              {...methods.register("fullName")}
              placeholder="ชื่อ-นามสกุล"
            />
            <Input {...methods.register("phone")} placeholder="เบอร์โทรศัพท์" />
            <Input
              {...methods.register("addressLine")}
              placeholder="บ้านเลขที่/ถนน/ซอย"
            />

            <Tabs value={step} className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="province">จังหวัด</TabsTrigger>
                <TabsTrigger value="district">อำเภอ</TabsTrigger>
                <TabsTrigger value="subDistrict">ตำบล</TabsTrigger>
                <TabsTrigger value="zip">รหัสไปรษณีย์</TabsTrigger>
              </TabsList>
              <TabsContent value="province">
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {provinces.map((p) => (
                    <Button
                      type="button"
                      variant={
                        selectedProvince?.id === p.id ? "default" : "outline"
                      }
                      key={p.id}
                      onClick={() => {
                        setSelectedProvince(p);
                        methods.setValue("province", p.name_th);
                        setStep("district");
                      }}
                    >
                      {p.name_th}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="district">
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {districts.map((d) => (
                    <Button
                      type="button"
                      variant={
                        selectedAmphure?.id === d.id ? "default" : "outline"
                      }
                      key={d.id}
                      onClick={() => {
                        setSelectedAmphure(d);
                        methods.setValue("district", d.name_th);
                        setStep("subDistrict");
                      }}
                    >
                      {d.name_th}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="subDistrict">
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {subDistricts.map((s) => (
                    <Button
                      type="button"
                      variant={
                        selectedTambon?.id === s.id ? "default" : "outline"
                      }
                      key={s.id}
                      onClick={() => {
                        setSelectedTambon(s);
                        methods.setValue("subDistrict", s.name_th);
                        setStep("zip");
                      }}
                    >
                      {s.name_th}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="zip">
                <Input
                  readOnly
                  {...methods.register("postalCode")}
                  placeholder="รหัสไปรษณีย์"
                />
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full">
              {isEditMode ? "อัปเดตที่อยู่" : "บันทึกที่อยู่"}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
