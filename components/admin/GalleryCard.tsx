"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import ImageCarouselDialog from "./ImagePreviewDialog";
import { Gallery } from "@prisma/client";
import { toast } from "react-toastify";

interface Props {
  gallery: Gallery;
  updateStatus: (
    id: string,
    status: "APPROVED" | "REJECTED",
    issues?: string[]
  ) => void;
}

const issues = [
  "ขอบและเงาไม่สมจริง",
  "แสงและสีไม่สม่ำเสมอ",
  "ร่องรอยรีทัช (Retouch Marks)",
  "วันเวลาและสถานที่ถ่ายภาพ",
  "อุปกรณ์ที่ใช้ถ่ายภาพ",
  "มีร่องรอยของซอฟต์แวร์ตัดต่อหรือไม่",
  "ขนาดรูปภาพไม่ตรงกับที่แจ้งไว้"
];

export default function GalleryCard({ gallery, updateStatus }: Props) {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };


  return (
    <>
      <Card className="p-4">
        <CardContent className="flex flex-col gap-2">
          <div className="cursor-pointer" onClick={() => setOpen(true)}>
            <Image
              src={gallery.images[0]}
              alt={gallery.title}
              className="w-full h-40 object-cover rounded"
              width={200}
              height={200}
            />
          </div>
          <h2 className="text-lg font-semibold truncate">{gallery.title}</h2>

          <p className="text-sm text-muted-foreground">
            ขนาดรูปภาพ: {gallery.imageSize} x {gallery.imageSize}
          </p>
          <p className="text-sm text-muted-foreground">
            {gallery.quantity} รูปภาพ
          </p>
          <p className="text-sm text-muted-foreground">
            Price: {gallery.price.toFixed(2)}฿
          </p>
          <Badge
            variant={
              gallery.status === "APPROVED"
                ? "default"
                : gallery.status === "REJECTED"
                ? "destructive"
                : "outline"
            }
          >
            {gallery.status}
          </Badge>

          {gallery.status === "REJECTED" &&
            gallery.rejectReasons &&
            gallery.rejectReasons.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-sm font-semibold text-destructive">
                  เหตุผลที่ถูกปฏิเสธ:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {gallery.rejectReasons.map((rejectReasons, index) => (
                    <li key={index}>{rejectReasons}</li>
                  ))}
                </ul>
              </div>
            )}

          {gallery.status === "PENDING" && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">
                  รายการตรวจสอบคุณภาพ:
                </p>
                {issues.map((issue) => (
                  <div key={issue} className="flex items-center gap-2">
                    <Checkbox
                      id={issue}
                      checked={selectedIssues.includes(issue)}
                      onCheckedChange={() => handleCheckboxChange(issue)}
                    />
                    <label htmlFor={issue} className="text-sm">
                      {issue}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    updateStatus(gallery.id, "APPROVED");
                    setSelectedIssues([]);
                    toast.success("อนุมัติรูปภาพแล้ว");
                  }}
                  size="sm"
                >
                  Approve
                </Button>
                <Button
                  onClick={() =>
                  {
                    updateStatus(gallery.id, "REJECTED", selectedIssues);
                    setSelectedIssues([]);
                    toast.error("ปฏิเสธรูปภาพแล้ว");
                  }}
                  size="sm"
                  variant="destructive"
                >
                  Reject
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {/* Modal img */}

      <ImageCarouselDialog
        images={gallery.imageAdmin}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
