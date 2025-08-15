"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const DeleteTransaction = async (id) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  //   const parsedBody = DeleteCategorySchema.safeParse(form);
  //   if (!parsedBody.success) {
  //     throw new Error("bad request");
  //   }

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId,
      id,
    },
  });

  if (!transaction) {
    throw new Error("bad request");
  }

  // creating prisma transaction

  await prisma.$transaction([
    // delete transaction
    prisma.transaction.delete({
      where: {
        userId,
        id,
      },
    }),

    // delete from aggregate tables

    // delete from month history
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),

    // delete from year history
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
};
