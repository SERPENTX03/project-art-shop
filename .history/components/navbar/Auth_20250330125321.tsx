import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const SignInBtn = async () => {
  const { userId } = await auth();

  console.log(userId);

  return (
    <>
      {!userId ? (
        <SignInButton mode="modal">
          <button className="button-custom p-2">GETSTARTED</button>
        </SignInButton>
      ) : (
        ""
      )}
    </>
  );
};

export const SignedOutProfile = async () => {
  const { userId } = await auth();

  const user = await currentUser();

  const imageUrl = user?.imageUrl || "/images/profile.png";
  return (
    <>
      {!userId ? (
        <Image
          className="w-full h-full"
          src={"/images/profile.png"}
          alt="ProfileFeck"
          width={200}
          height={200}
        />
      ) : (
        <div className="w-full h-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-full z-20 h-full cursor-pointer flex items-center justify-center">
                <Image
                  className="rounded-full  object-cover"
                  src={imageUrl}
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
      )}
    </>
  );
};
