"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";

import { useMediaQuery } from "../hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Currencies from "@/lib/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import Error from "next/error";
import SkeletonWrapper from "./SkeletonWrapper";
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";

export function CurrencyComboBox() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = useState(null);

  const userSettings = useQuery({
    queryKey: ["userSettings"],
    queryFn: () =>
      fetch("/api/user-settings").then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching currency settings.");
        }
        return res.json();
      }),
  });

  useEffect(() => {
    if (!userSettings.data) return;

    const userCurrency = Currencies.find(
      (item) => item.value === userSettings.data.currency
    );

    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  // to update user currency
  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data) => {
      toast.success("Currency updated successfully 🎉", {
        id: "update-currency",
      });
      setSelectedOption(
        Currencies.find((item) => item.value === data.currency) || null
      );
    },
    onError: () => {
      toast.error("Something went wrong ", {
        id: "update-currency",
      });
    },
  });

  const selectOption = useCallback(
    (currency) => {
      if (!currency) {
        return toast.error("Please select a currency");
      }

      toast.loading("Updating currency...", {
        id: "update-currency",
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen} >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-center"
              disabled={mutation.isPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="center">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className={"pl-2"}>
            Select Currency
          </DrawerTitle>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({ setOpen, setSelectedOption }) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
