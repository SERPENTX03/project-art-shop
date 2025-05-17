import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-3xl font-bold text-red-600">Payment Canceled</h1>
        <p className="text-muted-foreground">
          You have canceled the checkout process. No charge was made.
        </p>
        <Link href="/cart/checkout">
          <button className="button-custom py-2 px-4">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}
