// app/user-profile/page.tsx
"use client";

import { UserProfile } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function UserProfilePage() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div className="relative flex flex-col justify-center items-center p-5">
        <UserProfile
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
        />
      </div>
    </>
  );
}
