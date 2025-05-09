import { SlBasket } from "react-icons/sl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AddBacket = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer absolute top-2 right-2 border p-1 rounded-2xl bg-white/40 hover:bg-white/80 transition-colors duration-300 ease-in-out ">
          <SlBasket size={30} className="" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มสินค้าลงในตระกล้า</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default AddBacket;
