import prisma from "@/lib/prisma";
import { OverviewQueryScheme } from "@/schema/overview";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const GET = async (request) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQueryScheme.safeParse({ from, to });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const stats = await getCategoryStats(
    userId,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
};

const getCategoryStats = async (userId, from, to) => {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryItem"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
};
