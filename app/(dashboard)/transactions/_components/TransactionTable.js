"use client";

import { DateToUTCDate } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  filterFns,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { DataTableColumnHeader } from "@/components/datatable/ColumnHeader";
import { cn } from "@/lib/utils";
import { DataTableFacetedFilter } from "@/components/datatable/FacetedFilters";
import { DataTableViewOptions } from "@/components/datatable/ColumnToggle";
import { DataTablePagination } from "@/components/datatable/DataTablePagination";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { Button } from "@/components/ui/button";
import { DownloadIcon, MoreHorizontal, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteTransactionDialog from "./DeleteTransactionDialog";

const emptyData = [];

const columns = [
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <>
        <div className="flex gap-2 capitalize">
          {row.original.categoryItem}
          <div className="capitalize">{row.original.category}</div>
        </div>
      </>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <>
        {row.original.description ? (
          <div className="capitalize">{row.original.description}</div>
        ) : (
          <div className="text-muted-foreground">{"N/A"}</div>
        )}
      </>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <>
        {row.original.description ? (
          <div
            className={cn(
              "capitalize rounded-lg text-center p-2",
              row.original.type === "income"
                ? "bg-emerald-400/10 text-emerald-500"
                : "bg-rose-400/10 text-rose-500"
            )}
          >
            {row.original.type}
          </div>
        ) : (
          <div className="text-muted-foreground">{"N/A"}</div>
        )}
      </>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <>
        <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
          {row.original.formattedAmount}
        </p>
      </>
    ),
  },
  {
    id: "actions",
    enableHifing: false,
    cell: ({ row }) => (
      <>
        <RowActions transaction={row.original} />
      </>
    ),
  },
];

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: "true",
});

const TransactionTable = ({ from, to }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const history = useQuery({
    queryKey: ["transactions", "history", from, to],
    queryFn: () =>
      fetch(
        `/api/transactions-history?from=${DateToUTCDate(
          from
        )}&to=${DateToUTCDate(to)}`
      ).then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching categories for '${type}'.`);
        }
        return res.json();
      }),
  });

  const handleExportCSV = (data) => {
    // the first part here generates a func and we pass data to that func
    // this pattern is called "currying" where a func returns a func
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useReactTable({
    data: history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();
    history.data?.forEach((transaction) =>
      categoriesMap.set(transaction.category, {
        value: transaction.category,
        label: `${transaction.categoryItem} ${transaction.category}`,
      })
    );
    const uniqueCategories = new Set(categoriesMap.values());
    return Array.from(uniqueCategories);
  }, [history.data]);

  const typeOptions = [
    {
      value: "income",
      label: "Income",
    },
    {
      value: "expense",
      label: "Expense",
    },
  ];

  return (
    <div className="w-full px-8">
      <div className="flex flex-wrap items-center justify-between gap-2 py-4 ">
        <div className="flex gap-2">
          {table.getColumn("category") && (
            <>
              <DataTableFacetedFilter
                title="Category"
                column={table.getColumn("category")}
                options={categoriesOptions}
              />
            </>
          )}
          {table.getColumn("type") && (
            <>
              <DataTableFacetedFilter
                title="Type"
                column={table.getColumn("type")}
                options={typeOptions}
              />
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className="ml-auto h-8 lg: flex cursor-pointer"
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((row) => ({
                Category: row.original.category,
                CategoryIcon: row.original.categoryItem,
                Description: row.original.description,
                Type: row.original.type,
                Amount: row.original.amount,
                FormattedAmount: row.original.formattedAmount,
                Date: row.original.date,
              }));

              handleExportCSV(data);
            }}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <SkeletonWrapper isLoading={history.isFetching}>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </SkeletonWrapper>
    </div>
  );
};

export default TransactionTable;

const RowActions = ({ transaction }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteTransactionDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        transactionId={transaction.id}
      />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className={"h-8 w-8 p-0 cursor-pointer"}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={"end"}>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={"flex items-center gap-2 cursor-pointer"}
              onSelect={() => setShowDeleteDialog((prev) => !prev)}
            >
              <TrashIcon className="h-4 w-4 text-muted-foreground" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </>
  );
};
