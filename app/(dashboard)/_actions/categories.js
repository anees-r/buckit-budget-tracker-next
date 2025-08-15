"use server";

import prisma from "@/lib/prisma";
import CreateCategorySchema, {
  DeleteCategorySchema,
} from "@/schema/categories";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CreateCategory = async (form) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
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

export const DeleteCategory = async (form) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const { name, type } = parsedBody.data;

  return await prisma.category.delete({
    where: {
      userId_name_type: {
        userId,
        name,
        type,
      },
    },
  });
};
