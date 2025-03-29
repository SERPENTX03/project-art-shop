import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Link href="/account/orders">
          <button className="button-custom py-2 px-4">View My Orders</button>
        </Link>
        <Link href="/">
          <p className="text-sm text-blue-500 underline mt-4">Back to Home</p>
        </Link>
      </div>
    </div>
  );
}
