"use server";

import prisma from "@/lib/prisma";
import { CreateTransactionSchema } from "@/schema/transaction";
import { auth } from "@clerk/nextjs/server";

export const CreateTransaction = async (form) => {
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = parsedBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  // transactions in prisma are $transaction
  // prisma.transaction is the table

  await prisma.$transaction([
    // create transaction for user
    prisma.transaction.create({
      data: {
        userId,
        date,
        amount,
        type,
        description: description || "",
        category: categoryRow.name,
        categoryItem: categoryRow.icon, // accidentally named categoryIcon to CategoryItem and cant migrate now thats why using it here like this
      },
    }),

    // create or update aggregate table

    // month history
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },

      create: {
        userId,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },

      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    // year history
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },

      create: {
        userId,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },

      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
};
