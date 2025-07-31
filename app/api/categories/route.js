import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import z from "zod";

export const GET = async (request) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.URL);

  const paramType = searchParams.get("type");

  // nullable allows user to call api without passing a type param
  const validator = z.enum(["income", "expense"]).nullable;

  const queryParams = validator.safeParse(paramType);

  if (!queryParams.success) {
    return Respone.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // only include type in where if it is passed by client
    },
  });
};
