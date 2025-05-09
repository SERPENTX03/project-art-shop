import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShopProps } from "@/types/shop";
import { Settings } from "lucide-react";

interface ShopInterface {
  shop: ShopProps;
}

const DialogShopBank = ({ shop }: ShopInterface) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          จัดการบัญชี <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default DialogShopBank;
