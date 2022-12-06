import DeleteIcon from "assets/icons/Delete";
import EditIcon from "assets/icons/Edit";
import PreviewIcon from "assets/icons/Preview";
import React from "react";
import ReactTooltip from "react-tooltip";
export const columnsDefinition = (
  columnHelper: any,
  setCopy: Function,
  copySuccess: boolean
) => [
  columnHelper.accessor("status", {
    id: "status",
    header: () => <span className="font-montserratbold">Status</span>,
    cell: (info: any) =>
      info.getValue() ? (
        <div className="mx-auto w-4 h-4 rounded-full bg-green-600" />
      ) : (
        <div className="mx-auto w-4 h-4 rounded-full bg-red-600" />
      ),
  }),
  columnHelper.accessor("type", {
    id: "type",
    header: () => <span className="font-montserratbold">Type</span>,
    cell: (info: any) => info.getValue(),
  }),
  columnHelper.accessor("link", {
    id: "link",
    header: () => <span className="font-montserratbold">Link</span>,
    cell: (info: any) => (
      <>
        <ReactTooltip id="main" place="top" type={"dark"} effect={"float"} />
        <div
          data-for="main"
          className="flex flex-row items-center justify-between hover:cursor-pointer hover:bg-gray-300 hover:text-gray-800 hover:transition hover:ease-linear w-fit mx-auto p-1 rounded-sm"
          onClick={() => {
            navigator.clipboard.writeText(info.getValue());
            setCopy(true);
          }}
          data-tip={`${copySuccess ? "Copied!" : "Copy link"}`}
          data-iscapture="true"
        >
          <span className="font-montserratregular text-[18px]">
            {info.getValue().slice(0, 10)}...
          </span>
        </div>
      </>
    ),
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: () => <span className="font-montserratbold">Name</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[18px]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("dates", {
    id: "dates",
    header: () => <span className="font-montserratbold">Dates</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[18px]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("attendence", {
    id: "attendence",
    header: () => <span className="font-montserratbold">Attendence</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[18px]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("actions", {
    id: "actions",
    header: () => <span className="font-montserratbold">Actions</span>,
    cell: (info: any) => (
      <div className="flex flex-row items-baseline justify-evenly">
        <button
          data-for="main"
          className="flex flex-row items-center justify-between hover:cursor-pointer  hover:transition hover:ease-linear w-fit mx-auto p-1 rounded-sm"
          data-iscapture="true"
          data-tip={`Preview Stream`}
        >
          <PreviewIcon />
        </button>
        <button
          data-for="main"
          className="flex flex-row items-center justify-between hover:cursor-pointer w-fit mx-auto p-1 rounded-sm"
          data-iscapture="true"
          data-tip={`Edit Stream`}
        >
          <EditIcon />{" "}
        </button>
        <button
          data-for="main"
          className="flex flex-row items-center justify-between hover:cursor-pointer  w-fit mx-auto p-1 rounded-sm"
          data-iscapture="true"
          data-tip={`Delete Stream`}
        >
          <DeleteIcon />
        </button>
      </div>
    ),
  }),
];