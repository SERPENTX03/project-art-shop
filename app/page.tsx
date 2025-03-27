import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const page = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-10">
      <Navbar />
      <Hero />
    </div>
  );
};
export default page;
