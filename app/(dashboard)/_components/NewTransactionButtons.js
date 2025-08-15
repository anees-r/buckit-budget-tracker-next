"use client";
import React from "react";
import CreateTransactionDialog from "./CreateTransactionDialog";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const NewTransactionButtons = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <CreateTransactionDialog
        type={"income"}
        trigger={
          <Button
            className={`border-1 border-emerald-500 cursor-pointer hover:text-white ${
              resolvedTheme === "dark"
                ? "bg-emerald-950 hover:bg-emerald-700 text-white"
                : "bg-emerald-100 hover:bg-emerald-500 text-emerald-900"
            }`}
          >
            New income 🤑
          </Button>
        }
      />

      <CreateTransactionDialog
        type="expense"
        trigger={
          <Button
            className={`border-1 border-rose-500 cursor-pointer hover:text-white ${
              resolvedTheme === "dark"
                ? "bg-rose-950 hover:bg-rose-700 text-white"
                : "bg-rose-100 hover:bg-rose-500 text-rose-900"
            }`}
          >
            New expense 😭
          </Button>
        }
      />
    </div>
  );
};

export default NewTransactionButtons;
