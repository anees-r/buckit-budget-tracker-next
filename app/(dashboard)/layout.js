"use client";
import LoaderRotate from "@/components/LoaderRotate";
import NavBar from "@/components/NavBar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const layout = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center gap-5">
        <LoaderRotate />
      </div>
    );
  }

  if (!isSignedIn) {
    return router.push("/sign-in");
  } else {
    return (
      <div className="relative flex flex-col h-screen w-full">
        <NavBar />
        <div className="w-full">{children}</div>
        <div className="flex w-full justify-center py-4">
          <div className="bg-purple-200/20 dark:bg-purple-900/20 px-4 py-2 rounded-lg">
            developed with 💜 by{" "}
            <Link href="https://github.com/anees-r" target="_blank">
              <span className="text-purple-500 cursor-pointer">anees-r</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default layout;
