import { Separator } from "./ui/separator";

const Footer = () => {
  return (
    <footer className="py-12">
      <Separator className="bg-zinc-700" />
      <div className="flex h-full bg-red-400 justify-center border items-center">
        <h1 className="text-center">Footer</h1>
      </div>
    </footer>
  );
};
export default Footer;
