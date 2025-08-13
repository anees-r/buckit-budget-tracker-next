"use client";

import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import CountUp from "react-countup";

const StatsCards = ({ userSettings, from, to }) => {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
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

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <>
      <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
        <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth={true}>
          <StatCard
            formatter={formatter}
            value={income}
            title="Income"
            icon={
              <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
            }
          />
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth={true}>
          <StatCard
            formatter={formatter}
            value={expense}
            title="Expense"
            icon={
              <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10" />
            }
          />
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth={true}>
          <StatCard
            formatter={formatter}
            value={balance}
            title="Balance"
            icon={
              <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-purple-500 bg-purple-400/10" />
            }
          />
        </SkeletonWrapper>
      </div>
    </>
  );
};

export default StatsCards;

const StatCard = ({ formatter, value, title, icon }) => {
  const formatFn = useCallback(
    (value) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <>
      <Card className="flex flex-row h-24 w-full items-center gap-2 p-4">
        {icon}
        <div className="flex flex-col items-start gap-0">
          <p className="text-muted-foreground">{title}</p>
          <CountUp
            duration={1}
            preserveValue
            redraw={false}
            end={value}
            decimals={2}
            formattingFn={formatFn}
            className="text-2xl"
          />
        </div>
      </Card>
    </>
  );
};
