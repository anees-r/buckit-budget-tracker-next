"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CreateTransactionSchema } from "@/schema/transaction";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";

const CreateTransactionDialog = ({ trigger, type }) => {
  const form = useForm({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create a new{" "}
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-purple-500" : "text-rose-500",
                  "font-bold"
                )}
              >
                {type[0].toUpperCase() + type.slice(1)}
              </span>{" "}
              transaction
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input defaultValues="" {...field} />
                    </FormControl>
                    <FormDescription>
                      Transaction description (optional)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input defaultValues={0} type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Transaction amount (required)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategoryPicker type={type} />
                      </FormControl>
                      <FormDescription>
                        Select a category for this transaction
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTransactionDialog;
