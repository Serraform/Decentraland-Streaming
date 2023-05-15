export const columnsDefinition = (
  columnHelper: any,
) => [
  columnHelper.accessor("walletId", {
    id: "walletId",
    header: () => <span className="font-montserratbold">Wallet Id</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[14.5px]">
         {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("discount", {
    id: "discount",
    header: () => <span className="font-montserratbold">Discount %</span>,
    cell: (info: any) => (
      <span className="font-montserratregular text-[14px]">
        {info.getValue()}%
      </span>
    ),
  }),
];
