import ReactTooltip from "react-tooltip";
import IndeterminateCheckbox from "components/indeterminate-checkbox";
export const columnsDefinition = (
  columnHelper: any,
  setCopy: Function,
  copySuccess: boolean,
  handleSelectStream: Function
) => [
  {
    id: "select",
    header: ({ table }: any) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }: any) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  columnHelper.accessor("streamStatus", {
    id: "streamStatus",
    header: () => <span className="font-montserratbold">Status</span>,
    cell: (info: any) => {
      switch (info.getValue()) {
        case "Upcoming":
          return (
            <div className="flex justify-center flex-row items-center">
              <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-sky-400" />
              <span className="text-[14px]">Upcoming</span>
            </div>
          );
        case "Idle":
          return (
            <div className="flex justify-center flex-row items-center">
              <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-gray-600" />
              <span className="text-[14px]">Idle</span>
            </div>
          );
        case "Live":
          return (
            <div className="flex justify-center flex-row items-center">
              <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-green-600" />
              <span className="text-[14px]">Live</span>
            </div>
          );
        case "Suspended":
          return (
            <div className="flex justify-center flex-row items-center">
              <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-red-600" />
              <span className="text-[14px]">Suspended</span>
            </div>
          );
        default:
          return (
            <div className="flex justify-center flex-row items-center">
              <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-red-600" />
              <span className="text-[14px]">Suspended</span>
            </div>
          );
      }
    },
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: () => <span className="font-montserratbold">Name</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[14.5px]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("streamType", {
    id: "streamType",
    header: () => <span className="font-montserratbold">Type</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[14px]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("playBackUrl", {
    id: "playBackUrl",
    header: () => <span className="font-montserratbold">Playback URL</span>,
    cell: (info: any) => {
      const playbackId = info.row.original.streamInfo.PlayBackId;
      const playBackUrl = `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`;
      return (
        <>
          <ReactTooltip id="main" place="top" type={"dark"} effect={"float"} />
          <div
            data-for="main"
            className="flex flex-row items-center justify-between hover:cursor-pointer hover:bg-gray-300 hover:text-gray-800 hover:transition hover:ease-linear w-fit mx-auto p-1 rounded-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(playBackUrl);
              setCopy(true);
            }}
            data-tip={`${copySuccess ? "Copied!" : "Copy link"}`}
            data-iscapture="true"
          >
            <span className="font-montserratregular text-[14px]">
              {playBackUrl.slice(8, 25)}...
            </span>
          </div>
        </>
      );
    },
  }),

  columnHelper.accessor("dates", {
    id: "dates",
    header: () => <span className="font-montserratbold">Dates</span>,
    cell: (info: any) => {
      return (
        <span className="font-montserratregular text-[14px]">
          {new Date(info.row.original.streamStartDate).toDateString()}-
          {new Date(info.row.original.streamEndDate).toDateString()}
        </span>
      );
    },
  }),
  columnHelper.accessor("attendees", {
    id: "attendees",
    header: () => <span className="font-montserratbold">Attendance</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[14px]">
        {info.getValue()}
      </span>
    ),
  }),
];
