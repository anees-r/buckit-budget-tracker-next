// this is a server component
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";

const Dashboard = async () => {
  const user = await currentUser();

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="flex flex-wrap items-center justify-between gap-6 p-8">
          <p className="text-2xl font-bold">
            Hello,{" "}
            <span className="text-purple-500 font-bold ml-2">
              {user?.firstName ? user?.firstName : user?.username}! 👋
            </span>
          </p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              type={"income"}
              trigger={
                <Button
                  className={
                    "border-1 border-purple-500 bg-purple-950 text-white hover:bg-purple-700 hover:text-white"
                  }
                >
                  New income 🤑
                </Button>
              }
            />

            <CreateTransactionDialog
              type="expense"
              trigger={
                <Button
                  className={
                    "border-1 border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                  }
                >
                  New expense 😭
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
