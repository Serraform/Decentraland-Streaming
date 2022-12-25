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
};
const StreamTable: React.FC<Props> = ({
  columns,
  streams
}) => {

  const table = useReactTable({
    data: streams,
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
          {table.getCoreRowModel().rows.map((row) => (
            <tr key={row.id} className="my-2 py-2 h-20">
              {/* {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="d-flex flex-row items-center justify-center text-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))} */}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="h-4" />
      <div className="flex items-center gap-2">
        {/* <button
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
        </span> */}
      </div>
    </div>
  );
};

export default StreamTable;
