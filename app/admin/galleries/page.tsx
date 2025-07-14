import GalleryApprovalPage from "@/components/admin/GalleryApproval";
import { Separator } from "@/components/ui/separator";

export default function AdminGalleryPage() {

  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Gallery Approval</h1>
      <Separator className="mb-4" />
      <GalleryApprovalPage />
    </div>
  );
}
