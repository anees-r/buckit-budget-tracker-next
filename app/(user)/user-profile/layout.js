"use client";
import LoaderRotate from "@/components/LoaderRotate";
import Logo from "@/components/Logo";
import NavBar from "@/components/NavBar";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

const layout = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center gap-5">
        <LoaderRotate/>
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
      </div>
    );
  }
};

export default layout;
