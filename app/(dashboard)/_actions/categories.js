"use server";

import prisma from "@/lib/prisma";
import CreateCategorySchema from "@/schema/categories";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CreateCategory = async (form) => {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;

  return await prisma.category.create({
    data: {
      userId,
      name,
      icon,
      type,
    },
  });
};

export default CreateCategory;
