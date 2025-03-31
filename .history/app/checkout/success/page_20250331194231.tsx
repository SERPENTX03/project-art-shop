import Stripe from "stripe";
import { notFound } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const SuccessPage = async ({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) => {
  const params = await searchParams;
  const session_id = params.session_id;

  if (!session_id) return notFound();

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  return <div>SuccessPage</div>;
};
export default SuccessPage;
