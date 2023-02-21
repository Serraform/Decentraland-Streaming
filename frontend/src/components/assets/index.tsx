/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { columnsDefinition } from "components/assets/definitions/columns";
import { IAsset } from "components/stream/definitions";
// import { selectAsset, updateAssets } from "store/slices/assets.slice";
import { useSelector } from "react-redux";
// import type { AppDispatch } from "store/configStore";
import { RootState } from "store/configStore";
import AssetTable from "components/assets/asset-table";

import { useFetchAssetsByWalletIdQuery } from "store/api/assets.api";
// import { useNavigate } from "react-router-dom";
const Assets = () => {
  // const useAppDispatch = () => useDispatch<AppDispatch>();
  // const dispatch = useAppDispatch();
  const { walletID } = useSelector((state: RootState) => state.accountData);
  // const navigate = useNavigate();

  const {
    data: assets,
    error,
    isLoading: loading,
  } = useFetchAssetsByWalletIdQuery(walletID, {
    skip: walletID === "",
    refetchOnMountOrArgChange: true,
  });

  const { assetId, percentage } = useSelector(
    (state: RootState) => state.assetsData
  );

  // useEffect(() => {
  //   if (!isFetching && isSuccess) {
  //     dispatch(updateAssets(assets));
  //   }
  // }, [isSuccess]);

  const columnHelper = createColumnHelper<IAsset>();

  // const handleSelectAsset = useCallback(
  //   (selectedAsset: IAsset, index: number) => {
  //     // const setSelectedAsset = { ...selectedAsset } as any;
  //     // const navigateTo = `/asset/${setSelectedAsset.assetId}`;
  //     // navigate(navigateTo);
  //     // dispatch(selectAsset({ setSelectedAsset, index }));
  //     return;
  //   },
  //   [dispatch, navigate]
  // );
  const columns = useMemo(
    () => columnsDefinition(columnHelper, assetId, percentage),
    [columnHelper, assetId, percentage]
  );
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
      <AssetTable
        columns={columns}
        assets={
          assets?.map((asset: any) => ({
            ...asset,
            assetInfo: JSON.parse(asset.assetInfo),
          })).sort(
            (a, b) =>
              (new Date(b.timestamp) as any) -
              (new Date(a.timestamp) as any)
          ) as any as IAsset[]
        }
        handleSelectAsset={() => null}
      />
    </>
  );
};

export default Assets;
