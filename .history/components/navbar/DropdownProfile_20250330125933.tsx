import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

const DropdownProfile = ({ Image }: { Image: string }) => {
  return (
    <div className="w-full h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-full z-20 h-full cursor-pointer flex items-center justify-center">
            <Image
              className="rounded-full  object-cover"
              src={Image}
              alt="User Profile"
              width={200}
              height={200}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/user-profile">User Profile</Link>
            {/* ลิงก์ไปยังหน้าโปรไฟล์ */}
          </DropdownMenuItem>{" "}
          <DropdownMenuItem>
            <Link href="/creategallery">create</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>
            <SignOutButton>
              <button className="text-left w-full h-full">Logout</button>
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default DropdownProfile;
