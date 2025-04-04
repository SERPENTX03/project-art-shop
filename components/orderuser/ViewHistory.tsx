import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { History } from "lucide-react";

interface OrderProps {
  id: string;
  createdAt: string | Date;
  total: number;
  status: string;
}

interface OrderListClientProps {
  orders: OrderProps[];
}

const ViewHistory = ({ orders }: OrderListClientProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <History className="w-4 h-4 mr-2" /> View Purchase History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold mb-4">
          🧾 All Orders
        </DialogTitle>
        {orders.map((order, i) => (
          <div key={i} className="mb-4 p-4 border rounded">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Total:</strong> {order.total}฿
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};
export default ViewHistory;
