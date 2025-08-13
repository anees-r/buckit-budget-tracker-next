"use client";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  PlusSquare,
  TrashIcon,
  TrendingDown,
  TrendingUpIcon,
} from "lucide-react";
import React from "react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";

const Manage = () => {
  return (
    <>
      {/* Header */}
      <div className="border-b bg-card px-8">
        <div className="flex flex-wrap items-center justify-between gap6 py-8">
          <div>
            <p className="text-2xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>
      {/* Header End*/}
      <div className="flex flex-col gap-4 px-8 py-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>

        <CategoryList type="income" />

        <CategoryList type="expense" />
      </div>
    </>
  );
};

export default Manage;

const CategoryList = ({ type }) => {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching user categories.`);
        }
        return res.json();
      }),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <>
      <SkeletonWrapper isLoading={categoriesQuery.isFetching}>
        <Card>
          <CardHeader>
            <CardTitle className={"flex items-center justify-between gap-2"}>
              <div className="flex items-center gap-2">
                {type === "expense" ? (
                  <TrendingDown className="h-12 w-12 items-center rounded-lg round bg-rose-400/10 p-2 text-rose-500" />
                ) : (
                  <TrendingUpIcon className="h-12 w-12 items-center rounded-lg round bg-emerald-400/10 p-2 text-emerald-500" />
                )}
                <div>
                  {type === "income" ? "Incomes" : "Expenses"} categories
                  <div className="text-sm text-muted-foreground">
                    Sorted by name
                  </div>
                </div>
              </div>

              <CreateCategoryDialog
                type={type}
                successCallback={() => categoriesQuery.refetch()}
                trigger={
                  <Button className={"gap-2 text-sm cursor-pointer"}>
                    <PlusSquare className="h-4 w-4" />
                    Create category
                  </Button>
                }
              />
            </CardTitle>
          </CardHeader>
          <Separator />
          {!dataAvailable && (
            <>
              <div className="flex h-40 w-full flex-col items-center justify-center">
                <p>
                  No
                  <span
                    className={cn(
                      "m-1",
                      type === "income" ? "text-emerald-500" : "text-rose-500"
                    )}
                  >
                    {type[0].toUpperCase() + type.slice(1)}
                  </span>
                  categories yet
                </p>

                <p className="text-sm text-muted-foreground">
                  Create one to get started
                </p>
              </div>
            </>
          )}

          {dataAvailable && (
            <>
              <div className="grid grid-flow-row gap-3 px-6 py-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categoriesQuery.data.map((category) => (
                  <CategoryCard key={category.name} category={category} />
                ))}
              </div>
            </>
          )}
        </Card>
      </SkeletonWrapper>
    </>
  );
};

const CategoryCard = ({ category }) => {
  return (
    <>
      <div className="flex border-separate flex-col justify-between rounded-md border shadow-sm shadow-black/[0.1] dark:shadow-white/[0.1]">
        <div className="flex flex-col items-center gap-2 p-4">
          <span className="text-3xl" role="img">
            {category.icon}
          </span>
          {category.name}
        </div>
        <DeleteCategoryDialog
          category={category}
          trigger={
            <Button
              className={
                "flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-rose-500/20 cursor-pointer"
              }
              variant={"secondary"}
            >
              <TrashIcon className="h-4 w-4" />
              Remove
            </Button>
          }
        />
      </div>
    </>
  );
};
