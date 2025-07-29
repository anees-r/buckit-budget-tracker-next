"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoaderRotate from "./LoaderRotate";

export default function Example() {
  const { isLoaded, isSignedIn, userId, user, sessionId } = useAuth();

  const router = useRouter();

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center gap-5">
        {/* logo */}
        <LoaderRotate color="#ffc500" size={40} />
      </div>
    );
  }

  // Use `isSignedIn` to check if the user is signed in
  if (!isSignedIn) {
    // You could also add a redirect to the sign-in page here
    return router.push("/sign-in");
  } else {
    return router.push("/dashboard");
  }
}
