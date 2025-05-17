"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DashboardInfo() {
  return (
    <div className="flex justify-end mb-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">ดูข้อมูลร้าน</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ข้อมูลร้าน</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 text-sm">
            {/* <p>
              <strong>ชื่อร้าน:</strong> {shop.name}
            </p>
            <p>
              <strong>เบอร์โทร:</strong> {shop.phone}
            </p> */}
            {/* {shop.accountName && (
              <p>
                <strong>ชื่อบัญชี:</strong> {shop.accountName}
              </p>
            )}
            {shop.accountNumber && (
              <p>
                <strong>เลขที่บัญชี:</strong> {shop.accountNumber}
              </p>
            )}
            {shop.bankName && (
              <p>
                <strong>ธนาคาร:</strong> {shop.bankName}
              </p>
            )} */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
