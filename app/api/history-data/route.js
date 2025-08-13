import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import z from "zod";

// zod schema to validate data
const GetHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000),
});

export const GET = async (request) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);

  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = GetHistoryDataSchema.safeParse({
    timeframe,
    month,
    year,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const data = await getHistoryData(userId, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return Response.json(data);
};

const getHistoryData = async (userId, timeframe, period) => {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
};

const getYearHistoryData = async (userId, year) => {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  if (result.length === 0 || !result) {
    return [];
  }

  // now to handle case for month where there is no transaction, then we will modify the result to show 0 in order to properly display in bar chart
  const history = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;

    const month = result.find((item) => item.month === i);

    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }

  return history;
};

const getMonthHistoryData = async (userId, year, month) => {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      day: "asc",
    },
  });

  if (result.length === 0 || !result) {
    return [];
  }

  // now to handle case for days where there is no transaction, then we will modify the result to show 0 in order to properly display in bar chart
  const history = [];

  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    const day = result.find((item) => item.day === i);

    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      year,
      month,
      day: i,
      expense,
      income,
    });
  }

  return history;
};
