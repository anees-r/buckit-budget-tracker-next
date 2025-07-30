"use client";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const { resolvedTheme } = useTheme();

  return (
    <SignUp
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    />
  );
}
