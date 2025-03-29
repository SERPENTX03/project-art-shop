import { SignInButton, SignOutButton, UserProfile } from "@clerk/nextjs";
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
                <a href="/user-profile">User Profile</a>
                {/* ลิงก์ไปยังหน้าโปรไฟล์ */}
              </DropdownMenuItem>{" "}
              <DropdownMenuItem>
                <a href="/creategallery">create</a>
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
