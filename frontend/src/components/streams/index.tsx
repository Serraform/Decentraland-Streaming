import { useMemo, useState, useCallback } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnsDefinition } from "components/streams/definitions/columns";
import { IStream } from "components/stream/definitions";
import useFetchStreams from "hooks/useFetchStreams";
import { selectStream } from "store/slices/stream.slice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
const Streams = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const { streams, loading } = useFetchStreams();
  const columnHelper = createColumnHelper<IStream>();
  const [copySuccess, setCopy] = useState(false);

  const handleSelectStream = useCallback(
    (selectedStream: IStream, index: number) => {
      const setSelectedStream = { ...selectedStream } as any;
      dispatch(selectStream({setSelectedStream, index}));
    },
    [dispatch]
  );
  const columns = useMemo(
    () =>
      columnsDefinition(columnHelper, setCopy, copySuccess, handleSelectStream),
    [columnHelper, copySuccess, handleSelectStream]
  );
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
            <tr key={headerGroup.id}  >
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="pt-2 pb-2 ">
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
            <tr key={row.id} className="my-2 py-2 h-20 rounded">
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
      {loading && (
        <div className="pt-40 pb-40  border-t-0">
          <div className="preloader">
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      {table.getRowModel().rows.length === 0 && !loading && (
        <h1 className="font-montserratbold text-primary text-center pt-40 pb-40" style={{
          boxShadow: "0px 0px 10px rgba(193, 193, 193, 0.5)",
    overflow: "hidden"
        }}>
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
