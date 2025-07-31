import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const GET = async (request) => {
  const {userId} = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: userId,
        currency: "PKR",
      },
    });
  }

  console.log(userSettings)
  revalidatePath("/")
  return Response.json(userSettings);
};
