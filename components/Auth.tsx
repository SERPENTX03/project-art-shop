import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

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
