"use server";

import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const UpdateUserCurrency = async (currency) => {
  const parsedBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.update({
    where: {
      userId,
    },
    data: {
      currency,
    },
  });

  return userSettings;
};
