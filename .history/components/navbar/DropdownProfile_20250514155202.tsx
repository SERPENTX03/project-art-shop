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

import Image from "next/image";
import { DropdownProfileLink } from "@/data/DropdownProfile";

const DropdownProfile = ({ Image: imageSrc }: { Image: string }) => {
  return (
    <div className="w-full h-full">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            className="rounded-full object-cover cursor-pointer"
            src={imageSrc}
            alt="User Profile"
            width={200}
            height={200}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {DropdownProfileLink.map((link, index) => (
            <DropdownMenuItem asChild>
              <Link></Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem>
            <Link href="/dashboard">Shop Manager</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/account/orders">Purchase History</Link>
          </DropdownMenuItem>
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
