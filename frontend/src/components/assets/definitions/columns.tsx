import RefreshIcon from "assets/icons/Refresh";

export const columnsDefinition = (
  columnHelper: any,
  assetId: string,
  percentage: number,
  selectAssetForRefetchStatus: Function
) => [
  columnHelper.accessor("status", {
    id: "status",
    header: () => <span className="font-montserratbold">Status</span>,
    cell: (info: any) => {
      const isUploading = info.row.original.assetId === assetId;
      if (isUploading) {
        return (
          <span className="font-montserratregular text-[14.5px]">
            Uploading: {percentage}%
          </span>
        );
      } else if (info.row.original.uploadAssetStatus !== null) {
        const uploadAssetInfo = JSON.parse(info.row.original.uploadAssetStatus);
        if (uploadAssetInfo.Phase === "ready") {
          return (
            <div className="flex justify-center flex-row items-center">
              <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-green-600" />
              <span className="text-[14px]">Uploaded</span>
            </div>
          );
        } else if (uploadAssetInfo.Phase === "waiting" || uploadAssetInfo.Phase === "processing") {
          return (
            <div className="flex justify-center flex-row items-center">
              <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-yellow-600" />
              <span className="text-[14px]">Waiting for optimizations</span>
            </div>
          );
        }
      }
      return (
        <div className="flex justify-center flex-row items-center">
          <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-red-600" />
          <span className="text-[14px]">Upload incompleted</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("assetName", {
    id: "assetName",
    header: () => <span className="font-montserratbold">Name</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[14.5px] text-start">
        {info.getValue().length > 10
          ? `${info.getValue().slice(0, 15)}...`
          : info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("dateCreated", {
    id: "dateCreated",
    header: () => <span className="font-montserratbold">Last Update</span>,
    cell: (info: any) => {
      return (
        <span className="font-montserratregular text-[14.5px]">
          {new Date(info.row.original.timestamp).toDateString()}
        </span>
      );
    },
  }),
  columnHelper.accessor("reload", {
    id: "reload",
    header: () => <span className="font-montserratbold">Refresh asset</span>,
    cell: (info: any) => {
      return (
        <button onClick={(e) => {
          e.stopPropagation();
          selectAssetForRefetchStatus(info.row.original.assetId);
        }}>
          <RefreshIcon />
        </button>
      );
    },
  }),
];
