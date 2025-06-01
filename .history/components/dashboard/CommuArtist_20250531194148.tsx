import { MessageCircle } from "lucide-react";
import Link from "next/link";

const CommuArtist = () => {
  return (
    <Link href={"/community/artist"} className="flex gap-1 border">
      <p>CommuChat</p>
      <MessageCircle />
    </Link>
  );
};
export default CommuArtist;
