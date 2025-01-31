"use client";

// import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TrainerVerificationButton } from "./page";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = (handleUpdateTrainerStatus, handleDeleteSelected) => [
  {
    id: "delete",
    header: ({ table }) => {
      const handleDeleteSelectedWrap = () => {
        const selectedIds = table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original._id);
        handleDeleteSelected(selectedIds);
        table.getIsAllPageRowsSelected(0);
      };

      return table.getIsSomePageRowsSelected() ||
        table.getIsAllPageRowsSelected() ? (
        <Trash2
          onClick={handleDeleteSelectedWrap}
          className="absolute top-2 cursor-pointer hover:text-red-500 "
        />
      ) : null;
    },
  },

  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userId.name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "verified",
    header: "Verified",
    cell: ({ row }) => {
      const trainer = row.original;
      return (
        <TrainerVerificationButton
          trainer={trainer}
          onUpdate={handleUpdateTrainerStatus}
        />
      );
    },
  },
  {
    accessorKey: "specialties",
    header: "Specialties",
  },
  {
    accessorKey: "hourlyRate",
    header: "Hourly Rate",
    cell: ({ row }) => {
      const trainer = row.original;
      return trainer.hourlyRate || "N / A";
    },
  },
  {
    accessorKey: "availability",
    header: "Availability",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const trainer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(trainer._id)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
