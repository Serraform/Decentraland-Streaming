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
  columnHelper.accessor("walletId", {
    id: "walletId",
    header: () => <span className="font-montserratbold">Wallet Id</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[14.5px]">
         {info.getValue().slice(0, 6)}...
        {info.getValue().slice(info.getValue().length - 4, info.getValue().length)}
      </span>
    ),
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
