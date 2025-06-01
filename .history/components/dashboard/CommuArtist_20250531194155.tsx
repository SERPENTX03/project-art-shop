import { MessageCircle } from "lucide-react";
import Link from "next/link";

const CommuArtist = () => {
  return (
    <Link href={"/community/artist"} className="flex gap-1 border w-fit p-2">
      <p>CommuChat</p>
      <MessageCircle />
    </Link>
  );
};
export default CommuArtist;
