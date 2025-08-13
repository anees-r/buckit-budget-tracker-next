"use client";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}) => {
  const historyPeriods = useQuery({
    queryKey: ["overview", "history", "periods"],
    queryFn: () =>
      fetch(`/api/history-periods`).then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching history periods.`);
        }
        return res.json();
      }),
  });
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <SkeletonWrapper
          isLoading={historyPeriods.isFetching}
          fullWidth={false}
        >
          <Tabs
            value={timeframe}
            onValueChange={(value) => setTimeframe(value)}
          >
            <TabsList>
              <TabsTrigger className="cursor-pointer" value="year">Year</TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </SkeletonWrapper>
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
            <YearSelector
              period={period}
              setPeriod={setPeriod}
              years={historyPeriods.data || []}
            />
          </SkeletonWrapper>
          {timeframe === "month" && (
            <SkeletonWrapper
              isLoading={historyPeriods.isFetching}
              fullWidth={false}
            >
              <MonthSelector period={period} setPeriod={setPeriod} />
            </SkeletonWrapper>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPeriodSelector;

const YearSelector = ({ period, setPeriod, years }) => {
  return (
    <>
      <Select
        value={period.year.toString()}
        onValueChange={(value) =>
          setPeriod({
            month: period.month,
            year: parseInt(value),
          })
        }
      >
        <SelectTrigger className={"w-[180px] cursor-pointer"}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

const MonthSelector = ({ period, setPeriod }) => {
  return (
    <>
      <Select
        value={period.month.toString()}
        onValueChange={(value) =>
          setPeriod({
            year: period.year,
            month: parseInt(value),
          })
        }
      >
        <SelectTrigger className={"w-[180px] cursor-pointer"}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
            const monthString = new Date(period.year, month, 1).toLocaleString(
              "default",
              { month: "long" }
            );
            return (
              <SelectItem key={month} value={month.toString()}>
                {monthString}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};
