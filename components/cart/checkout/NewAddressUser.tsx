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
  onSuccess?: () => void;
}

export default function NewAddressDialog({
  initialData,
  isEditMode,
  children,
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const methods = useForm<Address>({
    defaultValues: initialData || {
      fullName: "",
      phone: "",
      addressLine: "",
      province: "",
      district: "",
      subDistrict: "",
      postalCode: "",
      isDefault: false,
    },
  });
  const [step, setStep] = useState("province");
  const [open, setOpen] = useState(false);

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

  // Reset form เมื่อเปิด dialog
  useEffect(() => {
    if (open) {
      if (initialData) {
        methods.reset(initialData);
        // Reset selections based on initial data
        const province = provinces.find((p) => p.name_th === initialData.province);
        const amphure = amphures.find((a) => a.name_th === initialData.district);
        const tambon = tambons.find((t) => t.name_th === initialData.subDistrict);
        
        setSelectedProvince(province || null);
        setSelectedAmphure(amphure || null);
        setSelectedTambon(tambon || null);
      } else {
        methods.reset({
          fullName: "",
          phone: "",
          addressLine: "",
          province: "",
          district: "",
          subDistrict: "",
          postalCode: "",
          isDefault: false,
        });
        setSelectedProvince(null);
        setSelectedAmphure(null);
        setSelectedTambon(null);
      }
      setStep("province");
    }
  }, [open, initialData, methods]);

  useEffect(() => {
    if (selectedTambon) {
      methods.setValue("postalCode", String(selectedTambon.zip_code));
    }
  }, [selectedTambon, methods]);

  const onSubmit = (data: Address) => {
    // Validation
    if (!data.fullName || !data.phone || !data.addressLine || 
        !data.province || !data.district || !data.subDistrict || !data.postalCode) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    startTransition(async () => {
      try {
        const res = isEditMode && initialData?.id
          ? await updateAddress(initialData.id, data)
          : await createAddress(data);

        if (res.success) {
          toast.success(
            isEditMode
              ? "อัปเดตที่อยู่เรียบร้อยแล้ว"
              : "เพิ่มที่อยู่เรียบร้อยแล้ว"
          );
          onSuccess?.();
          setOpen(false);
          
          // Reset form และ selections
          methods.reset();
          setSelectedProvince(null);
          setSelectedAmphure(null);
          setSelectedTambon(null);
          setStep("province");
        } else {
          toast.error(res.error || "เกิดข้อผิดพลาด");
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error("เกิดข้อผิดพลาดระหว่างบันทึกที่อยู่");
      }
    });
  };

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    setSelectedAmphure(null);
    setSelectedTambon(null);
    methods.setValue("province", province.name_th);
    methods.setValue("district", "");
    methods.setValue("subDistrict", "");
    methods.setValue("postalCode", "");
    setStep("district");
  };

  const handleAmphureSelect = (amphure: Amphure) => {
    setSelectedAmphure(amphure);
    setSelectedTambon(null);
    methods.setValue("district", amphure.name_th);
    methods.setValue("subDistrict", "");
    methods.setValue("postalCode", "");
    setStep("subDistrict");
  };

  const handleTambonSelect = (tambon: Tambon) => {
    setSelectedTambon(tambon);
    methods.setValue("subDistrict", tambon.name_th);
    methods.setValue("postalCode", String(tambon.zip_code));
    setStep("zip");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button disabled={isPending}>
            {isEditMode ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
          </Button>
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
              {...methods.register("fullName", { required: true })}
              placeholder="ชื่อ-นามสกุล"
              disabled={isPending}
            />
            <Input 
              {...methods.register("phone", { required: true })} 
              placeholder="เบอร์โทรศัพท์"
              disabled={isPending}
            />
            <Input
              {...methods.register("addressLine", { required: true })}
              placeholder="บ้านเลขที่/ถนน/ซอย"
              disabled={isPending}
            />

            <Tabs value={step} className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="province">จังหวัด</TabsTrigger>
                <TabsTrigger value="district" disabled={!selectedProvince}>อำเภอ</TabsTrigger>
                <TabsTrigger value="subDistrict" disabled={!selectedAmphure}>ตำบล</TabsTrigger>
                <TabsTrigger value="zip" disabled={!selectedTambon}>รหัสไปรษณีย์</TabsTrigger>
              </TabsList>
              <TabsContent value="province">
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {provinces.map((p) => (
                    <Button
                      type="button"
                      variant={selectedProvince?.id === p.id ? "default" : "outline"}
                      key={p.id}
                      onClick={() => handleProvinceSelect(p)}
                      disabled={isPending}
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
                      variant={selectedAmphure?.id === d.id ? "default" : "outline"}
                      key={d.id}
                      onClick={() => handleAmphureSelect(d)}
                      disabled={isPending}
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
                      variant={selectedTambon?.id === s.id ? "default" : "outline"}
                      key={s.id}
                      onClick={() => handleTambonSelect(s)}
                      disabled={isPending}
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
                  disabled={isPending}
                />
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending 
                ? "กำลังบันทึก..." 
                : isEditMode 
                  ? "อัปเดตที่อยู่" 
                  : "บันทึกที่อยู่"
              }
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}