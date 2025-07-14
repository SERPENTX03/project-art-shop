import { MessageCircle } from "lucide-react";
import Link from "next/link";

const CommuArtist = () => {
  return (
    <Link
      href={"/community/artist"}
      className="flex gap-1 border border-primary/50 w-fit p-2 "
    >
      <p>CommuPost</p>
      <MessageCircle />
    </Link>
  );
};
export default CommuArtist;
