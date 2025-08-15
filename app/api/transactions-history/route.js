import { GetFormatterForCurrency } from "@/lib/helpers";
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

  const transactions = await getTransactionsHistory(
    userId,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(transactions);
};

const getTransactionsHistory = async (userId, from, to) => {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });

  if (!userSettings) {
    throw new Error("User settings not found");
  }

  const formatter = GetFormatterForCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions.map((tran) => ({
    ...tran,
    // formatting amount with user currency
    formattedAmount: formatter.format(tran.amount),
  }));
};
