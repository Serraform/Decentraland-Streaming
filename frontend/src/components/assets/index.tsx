/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { columnsDefinition } from "components/assets/definitions/columns";
import { IAsset } from "components/stream/definitions";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/configStore";
import AssetTable from "components/assets/asset-table";
import type { AppDispatch } from "store/configStore";
import {
  useFetchAssetsByWalletIdQuery,
  useFetchAssetStatusQuery,
} from "store/api/assets.api";
import { selectAsset, stopUploadAsset } from "store/slices/assets.slice";
import AddIcon from "assets/icons/Add";
import AssetUploader from "components/asset-uploader/asset-uploader";
const Assets = () => {
  const [openAssetUploader, setOpenAssetUploader] = useState(false);
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const {
    data: assets,
    error,
    isLoading: loading,
    refetch,
  } = useFetchAssetsByWalletIdQuery(walletID, {
    skip: walletID === "",
    refetchOnMountOrArgChange: true,
  });

  const { assetId, percentage } = useSelector(
    (state: RootState) => state.assetsData
  );
  const { isSuccess: isSuccessStatusQuery, isLoading: isLoadingAssetStatus } =
    useFetchAssetStatusQuery(assetId, {
      skip: assetId === "" || percentage + "" !== "100.00",
      refetchOnMountOrArgChange: true,
    });
  const columnHelper = createColumnHelper<IAsset>();
  const selectAssetForRefetchStatus = (assetId: string) => {
    dispatch(selectAsset(assetId));
  };
  const columns = useMemo(
    () =>
      columnsDefinition(
        columnHelper,
        assetId,
        percentage,
        selectAssetForRefetchStatus
      ),
    [columnHelper, assetId, percentage, selectAssetForRefetchStatus]
  );
  useEffect(() => {
    if (
      percentage + "" === "100.00" &&
      isSuccessStatusQuery &&
      !isLoadingAssetStatus
    ) {
      refetch();
      dispatch(stopUploadAsset());
    }
  }, [percentage, isSuccessStatusQuery, isLoadingAssetStatus]);
  if ((loading || !assets) && !error)
    return (
      <>
        <div className="container pt-10">
          {walletID === "" && (
            <h1 className="dark:text-primary text-center font-montserratbold">
              Please connect your wallet
            </h1>
          )}
          <div className="preloader">
            {" "}
            <span></span>
            <span></span>
          </div>
        </div>
      </>
    );
  if (error)
    return (
      <div className="container pt-10">
        <h1 className="font-montserratbold text-primary text-center pt-20 pb-20 border-third border-r-0 border-t-0">
          Please refresh your browser to see your assets.
        </h1>
      </div>
    );
  return (
    <>
      {openAssetUploader && (
        <AssetUploader setOpenAssetUploader={setOpenAssetUploader} />
      )}
      <div className="container flex flex-row justify-end">
        <button
          className="btn-third flex flex-row items-center !pr-0"
          onClick={() => setOpenAssetUploader(true)}
        >
          <AddIcon />{" "}
          <span className="dark:text-white ml-2">Add new asset</span>
        </button>
      </div>
      <AssetTable
        columns={columns}
        assets={
          assets
            ?.map((asset: any) => ({
              ...asset,
              assetInfo: JSON.parse(asset.assetInfo),
            }))
            .sort(
              (a, b) =>
                (new Date(b.timestamp) as any) - (new Date(a.timestamp) as any)
            ) as any as IAsset[]
        }
        handleSelectAsset={() => null}
      />
    </>
  );
};

export default Assets;
