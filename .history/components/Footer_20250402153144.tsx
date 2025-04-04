import { Separator } from "./ui/separator";

const Footer = () => {
  return (
    <footer>
      <Separator className="bg-zinc-700" />

      <div className="py-12 flex h-full flex-col justify-center border items-center">
        <h1 className="text-center">Footer</h1>
      </div>
    </footer>
  );
};
export default Footer;
