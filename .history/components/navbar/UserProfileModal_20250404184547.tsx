"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserProfile } from "@clerk/nextjs";
import { X } from "lucide-react";
import { useState } from "react";

export default function UserProfileDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-left px-2 py-1.5 hover:bg-muted rounded">
          User Profile
        </button>
      </DialogTrigger>

      <DialogContent className="fixed inset-0 z-50 w-full h-full max-w-none max-h-none p-0 overflow-hidden rounded-none bg-white dark:bg-gray-900">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>โปรไฟล์ของคุณ</DialogTitle>
          <DialogClose className="absolute right-6 top-4">
            <X className="w-5 h-5" />
          </DialogClose>
        </DialogHeader>
        <div className="w-full h-[calc(100%-4rem)] overflow-auto px-4 pb-4">
          <UserProfile routing="hash" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
