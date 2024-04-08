import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const loading = () => {
  return (
    <Table className={"mt-4 xl:mt-0 w-full rounded-md hidden xl:inline-table"}>
      <TableHeader className="bg-gray-300">
        <TableRow>
          <TableHead className="">Verified</TableHead>
          <TableHead className="">Name</TableHead>
          <TableHead className="">Email</TableHead>
          <TableHead className="">Specialties</TableHead>
          <TableHead className="">Experience</TableHead>
          <TableHead className="">Hourly Rate</TableHead>
          <TableHead className="">Availability</TableHead>
          <TableHead className="">Rating</TableHead>
          <TableHead className=""></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">
            <Skeleton className="w-full h-full bg-slate-600" />
          </TableCell>
          <TableCell className="font-medium">
            <Skeleton className="w-full h-full bg-slate-600" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-full h-full bg-slate-600" />
          </TableCell>
          <TableCell className="max-w-[10rem]">
            <Skeleton className="w-full h-full bg-slate-600" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-full h-full bg-slate-600" />
          </TableCell>
          <TableCell></TableCell>
          <TableCell className="max-w-[10rem]">
            <Skeleton className="w-full h-full bg-slate-600" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-full bg-slate-600" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-full bg-slate-600" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default loading;
