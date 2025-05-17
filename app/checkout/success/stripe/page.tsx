import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

const SuccessPage = async ({ searchParams }: SuccessPageProps) => {
  const sessionId = searchParams.session_id;

  if (!sessionId) return notFound();

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });

  const lineItems = session.line_items?.data ?? [];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">🎉 Payment Successful!</h1>
      <p className="text-muted-foreground mb-2">
        Thank you for your purchase. Your payment was successful.
      </p>

      <div className="space-y-3 mt-4">
        <p>
          <strong>Customer:</strong> {session.customer_email}
        </p>
        <p>
          <strong>Total Paid:</strong>{" "}
          {session.amount_total && session.currency
            ? `${session.amount_total / 100} ${session.currency.toUpperCase()}`
            : "N/A"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {session.payment_status === "paid" ? "✅ Paid" : "❌ Unpaid"}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">🧾 Receipt</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {lineItems.map((item) => (
            <li key={item.id}>
              {item.quantity} × {item.description} ={" "}
              {item.amount_total && session.currency
                ? `${item.amount_total / 100} ${session.currency.toUpperCase()}`
                : ""}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-center">
        <a
          href="/account/orders"
          className="button-custom inline-block px-6 py-2 mt-4"
        >
          📦 Go to Orders
        </a>
      </div>
    </div>
  );
};

export default SuccessPage;
