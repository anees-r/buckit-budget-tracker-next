"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CategoryPicker = ({ type, onChange }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [onChange, value]);

  const categoryQuery = useQuery({
    queryKey: ["categories", type], // whenever we put a param (i.e type) in tanstack query, it refetches data if the param changes
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching categories for '${type}'.`);
        }
        return res.json();
      }),
  });

  const selectedCategory = categoryQuery.data?.find(
    (category) => category.name === value
  );

  const successCallback = useCallback(
    (category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            role={"combobox"}
            aria-expanded={open}
            className={"sm:w-[200px] justify-between cursor-pointer"}
          >
            {selectedCategory ? (
              <CategoryRow category={selectedCategory} />
            ) : (
              "Select category"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={"p-0 w-[200px]"}>
          <Command
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <CommandInput placeholder="Search category" />
            <CreateCategoryDialog
              type={type}
              successCallback={successCallback}
            />
            <CommandEmpty>
              <p>Category not found</p>
              <p className="text-xs text-muted-foreground">
                Tip: create a new category
              </p>
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {categoryQuery.data &&
                  categoryQuery.data.map((category) => (
                    <CommandItem
                      className={"cursor-pointer"}
                      key={category.name}
                      onSelect={() => {
                        setValue(category.name);
                        setOpen((prev) => !prev);
                      }}
                    >
                      <CategoryRow category={category} />
                      <Check
                        className={cn(
                          "mr-2 w-4 h-4 opacity-0",
                          value === category.name && "opacity-100"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

const CategoryRow = ({ category }) => {
  return (
    <>
      <div className="flex items-center gap-2 ">
        <span role="img">{category.icon}</span>
        <span>{category.name}</span>
      </div>
    </>
  );
};

export default CategoryPicker;
