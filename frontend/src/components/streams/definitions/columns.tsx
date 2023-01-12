import ReactTooltip from "react-tooltip";
export const columnsDefinition = (
  columnHelper: any,
  setCopy: Function,
  copySuccess: boolean,
  handleSelectStream: Function
) => [
  columnHelper.accessor("status", {
    id: "status",
    header: () => <span className="font-montserratbold">Status</span>,
    cell: (info: any) =>
      info.row.original.streamInfo.Suspended ? (
        <div className="flex justify-center flex-row items-center">
          <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-red-600" />
          <span className="text-[14px]">Suspended</span>
        </div>
      ) : info.row.original.streamInfo.IsActive ? (
        <div className="flex justify-center flex-row items-center">
          <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-green-600" />
          <span className="text-[14px]">Live</span>
        </div>
      ) : (
        <div className="flex justify-center flex-row items-center">
          <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-gray-600" />
          <span className="text-[14px]">Idle</span>
        </div>
      ),
  }),
  
  columnHelper.accessor("streamType", {
    id: "streamType",
    header: () => <span className="font-montserratbold">Type</span>,
    cell: (info: any) =>     <span className="font-montserratregular text-[14px]">{info.getValue()}</span>,
  }),
  columnHelper.accessor("playbackUrl", {
    id: "playbackUrl",
    header: () => <span className="font-montserratbold">Playback URL</span>,
    cell: (info: any) => {
      const playbackId = info.row.original.streamInfo.PlayBackId;
      const playbackUrl = `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`;
      return (
        <>
          <ReactTooltip id="main" place="top" type={"dark"} effect={"float"} />
          <div
            data-for="main"
            className="flex flex-row items-center justify-between hover:cursor-pointer hover:bg-gray-300 hover:text-gray-800 hover:transition hover:ease-linear w-fit mx-auto p-1 rounded-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(playbackUrl);
              setCopy(true);
            }}
            data-tip={`${copySuccess ? "Copied!" : "Copy link"}`}
            data-iscapture="true"
          >
            <span className="font-montserratregular text-[14px]">
            {playbackUrl.slice(8, 25)}...
            </span>
          </div>
        </>
      );
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
    header: () => <span className="font-montserratbold">Attendence</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[14px]">
        {info.getValue()}
      </span>
    ),
  }),
  // columnHelper.accessor("actions", {
  //   id: "actions",
  //   header: () => <span className="font-montserratbold">Actions</span>,
  //   cell: (info: any) => (
  //     <div className="flex flex-row items-baseline justify-evenly">
  //       <button
  //         data-for="main"
  //         className="flex w-[2rem] flex-row items-center justify-between hover:cursor-pointer  hover:transition hover:ease-linear  mx-auto p-1 rounded-sm"
  //         data-iscapture="true"
  //         data-tip={`Check Stream Info`}
  //       >
  //         <PreviewIcon />
  //       </button>
  //       <button
  //         data-for="main"
  //         className="flex w-[2rem] flex-row items-center justify-between hover:cursor-pointer  mx-auto p-1 rounded-sm"
  //         data-iscapture="true"
  //         data-tip={`Edit Stream`}
  //         onClick={() => handleSelectStream(info.row.original, info.row.index)}
  //       >
  //         <EditIcon />{" "}
  //       </button>
  //       <button
  //         data-for="main"
  //         className="flex w-[1.7rem] flex-row items-center justify-between hover:cursor-pointer   mx-auto p-1 rounded-sm"
  //         data-iscapture="true"
  //         data-tip={`Delete Stream`}
  //       >
  //         <DeleteIcon />
  //       </button>
  //     </div>
  //   ),
  // }),
];
