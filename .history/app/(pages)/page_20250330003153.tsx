import CardMainContainer from "@/components/cardgalleries/CardMainContainer";
import Hero from "@/components/Hero";

const Page = ({ searchParams }: { searchParams?: { category?: string } }) => {
  const params = searchParams || {};

  return (
    <div>
      <Hero />
      <CardMainContainer searchParams={params} />
    </div>
  );
};
export default Page;
