"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  gallery: {
    id: string;
    title: string;
    price: number;
    images: string[];
    status: "PENDING" | "APPROVED" | "REJECTED";
  };
  updateStatus: (id: string, status: "APPROVED" | "REJECTED") => void;
}

const issues = [
  "ขอบและเงาไม่สมจริง",
  "แสงและสีไม่สม่ำเสมอ",
  "ร่องรอยรีทัช (Retouch Marks)",
  "วันเวลาและสถานที่ถ่ายภาพ",
  "อุปกรณ์ที่ใช้ถ่ายภาพ",
  "มีร่องรอยของซอฟต์แวร์ตัดต่อหรือไม่",
];

export default function GalleryCard({ gallery, updateStatus }: Props) {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const handleCheckboxChange = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col gap-3">
        <Image
          src={gallery.images[0]}
          alt={gallery.title}
          className="w-full h-40 object-cover rounded"
          width={200}
          height={200}
        />
        <h2 className="text-lg font-semibold truncate">{gallery.title}</h2>
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
                onClick={() => updateStatus(gallery.id, "APPROVED")}
                size="sm"
              >
                Approve
              </Button>
              <Button
                onClick={() =>
                  updateStatus(gallery.id, "REJECTED", selectedIssues)
                }
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
  );
}
