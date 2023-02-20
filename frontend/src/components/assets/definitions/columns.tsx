export const columnsDefinition = (
  columnHelper: any,
) => [
  columnHelper.accessor("assetName", {
    id: "assetName",
    header: () => <span className="font-montserratbold">Name</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[14.5px]">
        {info.getValue()}
      </span>
    ),
  }),
];
