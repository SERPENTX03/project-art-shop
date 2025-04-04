import { Separator } from "./ui/separator";

const Footer = () => {
  return (
    <footer className="py-12 flex h-full bg-red-400 flex-col justify-center border items-center">
      <Separator className="bg-zinc-700" />
      <div className="">
        <h1 className="text-center">Footer</h1>
      </div>
    </footer>
  );
};
export default Footer;
