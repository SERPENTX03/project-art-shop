import CardMainContainer from "@/components/cardart/CardMainContainer";
import Hero from "@/components/Hero";

const page = ({ searchParams }: { searchParams?: { category?: string } }) => {
  return (
    <div>
      <Hero />
      <CardMainContainer searchParams={searchParams} />
    </div>
  );
};
export default page;
