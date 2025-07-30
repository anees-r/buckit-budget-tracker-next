"use client"
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import React from "react";

const MyUserButton = () => {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <UserButton
        userProfileMode="navigation"
        userProfileUrl="/user-profile"
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
    </>
  );
};

export default MyUserButton;
