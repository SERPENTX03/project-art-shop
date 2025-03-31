import Stripe from "stripe";
import { notFound } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const SuccessPage = ({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) => {
  const params = await searchParams;
  const session_id = params.session_id;

  return <div>SuccessPage</div>;
};
export default SuccessPage;
