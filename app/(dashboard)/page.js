// this is a server component
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import NewTransactionButtons from "./_components/NewTransactionButtons";
import Overview from "./_components/Overview";
import History from "./_components/History";

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

          <NewTransactionButtons />
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};

export default Dashboard;
