"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserProfile } from "@clerk/nextjs";
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

      <DialogContent className="w-full max-w-none h-[90vh] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">โปรไฟล์ของคุณ</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full">
          <UserProfile routing="hash" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
