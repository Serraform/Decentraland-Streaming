import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { IStreamVOD, ILiveStream } from "components/stream/definitions";
type Props = {
  columns: any;
  streams: (IStreamVOD | ILiveStream)[];
  handleSelectStream: Function;
};
const StreamTable: React.FC<Props> = ({
  columns,
  streams,
  handleSelectStream,
}) => {
  const table = useReactTable({
    data: streams,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="container pt-10">
      <table className="border-third  border rounded w-[100%]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
         
              className="my-2 py-2 h-20 rounded  hover:opacity-2 hover:bg-[#f7f9fa] hover:cursor-pointer hover:transition-transform dark:hover:bg-[#1a1d1e]"
              onClick={(e) => handleSelectStream(row.original)}
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
      {table.getRowModel().rows.length === 0 && (
        <h1
          className="font-montserratbold text-primary text-center pt-40 pb-40"
          style={{
            boxShadow: "0px 0px 10px rgba(193, 193, 193, 0.5)",
            overflow: "hidden",
          }}
        >
          Please click "Add new stream" to start streaming
        </h1>
      )}
      <div className="h-4" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1 dark:text-white dark:border-none"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1  dark:text-white dark:border-none"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <span className="flex items-center gap-1 dark:text-white">
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

export default StreamTable;
