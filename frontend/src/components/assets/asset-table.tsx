/* eslint-disable react-hooks/exhaustive-deps */
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { IAsset } from "components/stream/definitions";
import {  useMemo } from "react";
type Props = {
  columns: any;
  assets: IAsset[];
  handleSelectAsset: Function;
};
const AssetTable: React.FC<Props> = ({
  columns,
  assets,
  handleSelectAsset,
}) => {
  const table = useReactTable({
    data: assets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState:{
      pagination:{
        pageIndex:0,
        pageSize:5
      }
    }
  });
  const headerGroups = useMemo(() => table.getHeaderGroups(), [table]);
  const pageCount = useMemo(() => table.getPageCount(), [table]);
  const pagination =  table.getState().pagination;
  const rowModel = useMemo(() => table.getRowModel(), [table, pagination]);
  const canPreviousPage =  table.getCanPreviousPage()
  const canNextPage =  table.getCanNextPage()
  return (
    <div className="container pt-5">
      
      <table className="border-third  border rounded w-[100%]">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="pt-2 border-b-none pb-2 rounded">
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
              onClick={(e) => handleSelectAsset(row.original)}
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
          Please click "Schedule new stream" to upload your first asset and start streaming
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
          <strong>
            {pagination.pageIndex + 1} of {pageCount}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default AssetTable;
