/* eslint-disable react-hooks/exhaustive-deps */
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { PremiumUser } from "components/premium-users/definitions/types";
import { useMemo } from "react";
import PremiumIcon from "assets/icons/Premium";

type Props = {
  columns: any;
  premiumUsers: PremiumUser[];
  handleSelectUser: Function;
};
const PremiumUsersTable: React.FC<Props> = ({
  columns,
  premiumUsers,
  handleSelectUser,
}) => {
  const table = useReactTable({
    data: premiumUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });
  const headerGroups = useMemo(() => table.getHeaderGroups(), [table]);
  const pageCount = useMemo(() => table.getPageCount(), [table]);
  const canPreviousPage = table.getCanPreviousPage();
  const pagination = table.getState().pagination;
  const rowModel = useMemo(() => table.getRowModel(), [table, pagination]);
  const canNextPage = table.getCanNextPage();
  return (
    <>
      <div className="container flex flex-row justify-between items-center pt-10">
        <h1 className="font-montserratbold tracking-[0rem] text-primary dark:text-white text-xl">
          Premium Users
        </h1>
        <button
          className="btn-third flex flex-row items-center !pr-0"
          onClick={() => {
            handleSelectUser({
              walletId: "",
              discount: 0,
              action: "new",
              open: true,
            });
          }}
        >
          <PremiumIcon />{" "}
          <span className="dark:text-white ml-2">Add Premium User</span>
        </button>
      </div>
      <div className="container pt-5">
        <table className="border-third  border rounded w-[100%]">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="pt-2 border-b-none pb-2 rounded"
                  >
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
            {rowModel.rows.map((row) => (
              <tr
                key={row.id}
                className="my-2 py-2 h-20 rounded  hover:opacity-2 hover:bg-[#f7f9fa] hover:cursor-pointer hover:transition-transform dark:hover:bg-[#1a1d1e]"
                onClick={(e) => {
                  if ((e.target as HTMLDivElement).nodeName === "INPUT") {
                    return;
                  }
                  handleSelectUser({
                    ...row.original,
                    action: "edit",
                    open: true,
                  });
                }}
              >
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
        {rowModel.rows.length === 0 && (
          <h1
            className="font-montserratbold text-primary text-center pt-40 pb-40"
            style={{
              boxShadow: "0px 0px 10px rgba(193, 193, 193, 0.5)",
              overflow: "hidden",
            }}
          >
            Please click "Add Premium User"
          </h1>
        )}
        <div className="h-4" />
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1 dark:text-white dark:border-none"
            onClick={() => table.previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>
          <button
            className="border rounded p-1  dark:text-white dark:border-none"
            onClick={() => table.nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </button>
          <span className="flex items-center gap-1 dark:text-white">
            <div>Page</div>
            {pageCount !== 0 && (
              <strong>
                {pagination.pageIndex + 1} of {pageCount}
              </strong>
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default PremiumUsersTable;
