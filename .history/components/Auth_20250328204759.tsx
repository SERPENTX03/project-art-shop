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

export const SignInBtn = async () => {
  const { userId } = await auth();

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
        <div className="w-full h-full ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                className="rounded-full border w-full h-full cursor-pointer"
                src={imageUrl}
                alt="User Profile"
                width={200}
                height={200}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
};
