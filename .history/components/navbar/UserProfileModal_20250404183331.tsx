"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { UserProfile } from "@clerk/nextjs";
import { X } from "lucide-react";
import { useState } from "react";

export default function UserProfileModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="w-full text-left px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          User Profile
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-3xl max-h-[90vh] overflow-auto -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-gray-900 p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">User Profile</h2>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <UserProfile />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
