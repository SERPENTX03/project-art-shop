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
  console.log(user);

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
            <Image
              className="rounded-full"
              src={imageUrl}
              alt="User Rrofile"
              width={200}
              height={200}
            />
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
};
