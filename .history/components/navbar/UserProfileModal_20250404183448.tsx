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

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>โปรไฟล์ของคุณ</DialogTitle>
        </DialogHeader>
        <UserProfile />
      </DialogContent>
    </Dialog>
  );
}
