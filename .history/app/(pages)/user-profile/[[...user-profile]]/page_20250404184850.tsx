import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserProfile } from "@clerk/nextjs";
import { X } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

export default function UserProfilePage({ searchParams }: Props) {
  const isModal = searchParams.modal === "true";

  if (!isModal) {
    // แสดงเต็มหน้าธรรมดา
    return (
      <div className="min-h-screen px-4 py-8">
        <UserProfile routing="path" />
      </div>
    );
  }

  return (
    <Dialog open>
      <DialogContent className="fixed inset-0 z-50 w-full h-full max-w-none max-h-none p-0 overflow-hidden rounded-none bg-white dark:bg-black">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            โปรไฟล์ของคุณ
          </DialogTitle>
          <button
            onClick={() => redirect("/")} // ✅ กลับหน้าเดิม
            className="absolute right-4 top-4"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="w-full h-[calc(100%-4rem)] overflow-auto px-4 pb-4">
          <UserProfile routing="path" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
