import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const GET = async (request) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const periods = await getHistoryPeriods(userId);

  return Response.json(periods);
};

const getHistoryPeriods = async (userId) => {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [
      {
        year: "asc",
      },
    ],
  });

  const years = result.map((item) => item.year);

  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
};
