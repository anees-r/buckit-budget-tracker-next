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
            className={`border-1 border-emerald-500 text-white hover:text-white ${
              resolvedTheme === "dark"
                ? "bg-emerald-950 hover:bg-emerald-700"
                : "bg-emerald-700 hover:bg-emerald-900"
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
            className={`border-1 border-rose-500 text-white hover:text-white ${
              resolvedTheme === "dark"
                ? "bg-rose-950 hover:bg-rose-700"
                : "bg-rose-700 hover:bg-rose-900"
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
