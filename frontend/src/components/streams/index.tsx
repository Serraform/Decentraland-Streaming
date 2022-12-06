import React, { useMemo, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnsDefinition } from "components/streams/definitions/columns";

type Stream = {
  status: boolean;
  type: string;
  link: string;
  name: string;
  dates: string;
  attendence: number;
};

const data: Stream[] = [
  {
    status: true,
    type: "VOD",
    link: "https://example.com",
    name: "Example stream",
    dates: "2020-01-01T00:00:00Z",
    attendence: 0,
  },
  {
    status: true,
    type: "VOD",
    link: "https://example.com",
    name: "Example stream",
    dates: "2020-01-01T00:00:00Z",
    attendence: 0,
  },
];

const Streams = () => {
  const columnHelper = createColumnHelper<Stream>();
  const [copySuccess, setCopy] = useState(false);
  const columns = useMemo(
    () => columnsDefinition(columnHelper, setCopy, copySuccess),
    [columnHelper,
      copySuccess]
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="container pt-10">
      <table className="border-third border-solid border w-[100%]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b-third border-b ">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="pt-2 pb-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="my-2 py-2 h-20">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="d-flex flex-row items-center justify-center text-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getRowModel().rows.length === 0 && (
        <h1 className="font-montserratbold text-primary text-center pt-40 pb-40 border-third border border-t-0">
          You don’t have anything yet click on <br />
          “Add new stream”
        </h1>
      )}
      <div className="h-4" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default Streams;
