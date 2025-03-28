import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export const SignInBtn = async () => {
  const { userId } = await auth();

  return (
    <>
      {!userId ? (
        <SignInButton mode="modal">
          <button className="cursor-pointer bg-primary p-2 rounded-2xl text-text hover:bg-zinc-800 transition-all duration-500 ease-in-out">
            GETSTARTED
          </button>
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
          <Image
            className="rounded-full"
            src={imageUrl}
            alt="User Rrofile"
            width={200}
            height={200}
          />
          <SignOutButton />
        </div>
      )}
    </>
  );
};
