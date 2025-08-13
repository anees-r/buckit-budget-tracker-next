"use client";

import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

const CategoryStats = ({ userSettings, from, to }) => {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching stats for overview.`);
        }
        return res.json();
      }),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
        <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth={true}>
          <CategoriesCard
            formatter={formatter}
            type={"income"}
            data={statsQuery.data || []}
          />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth={true}>
          <CategoriesCard
            formatter={formatter}
            type={"expense"}
            data={statsQuery.data || []}
          />
        </SkeletonWrapper>
      </div>
    </>
  );
};

export default CategoryStats;

const CategoriesCard = ({ formatter, type, data }) => {
  const filteredData = data.filter((item) => item.type === type);

  const total = filteredData.reduce(
    (acc, item) => acc + (item._sum?.amount || 0),
    0
  );

  return (
    <>
      <Card className="h-80 w-full col-span-6">
        <CardHeader>
          <CardTitle
            className={
              "grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col"
            }
          >
            {type === "income" ? "Incomes" : "Expenses"} by category
          </CardTitle>
        </CardHeader>
        <div className="flex items-center justify-between gap-2">
          {filteredData.length === 0 && (
            <div className="flex h-60 w-full flex-col items-center justify-center">
              No data for the selected period
              <p className="text-sm text-muted-foreground">
                Try selecting a different period or try adding new {type}s
              </p>
            </div>
          )}
          {filteredData.length > 0 && (
            <ScrollArea className={"h-60 w-full px-4"}>
              <div className="flex w-full flex-col p-4 gap-4">
                {filteredData.map((item) => {
                  const amount = item._sum.amount || 0;
                  const percentage = (amount * 100) / (total || amount);

                  return (
                    <>
                      <div className="flex flex-col gap-2" key={item.category}>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-muted-foreground">
                            {item.categoryItem} {item.category}
                            <span className="ml-2 text-xs text-muted-foreground">
                                ({percentage.toFixed(0)}%)
                            </span>
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatter.format(amount)}
                          </span>
                        </div>
                        <Progress value={percentage}
                            indicator={type === "income" ? "bg-emerald-500" : "bg-rose-500"}
                        />
                      </div>
                    </>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </Card>
    </>
  );
};
