/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useCallback, useReducer, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { columnsDefinition } from "components/premium-users/definitions/columns";
import { PremiumUser } from "components/premium-users/definitions/types";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "store/configStore";

import { RootState } from "store/configStore";
import PremiumUsersTable from "components/premium-users/table";
import PremiumUserModal from "components/premium-users/premium-user";
import {
  useFetchListUsersPremiumQuery,
  useUpdateUserPremiumMutation,
} from "store/api/premiumuser.api";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
const PremiumUsers = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const [premiumUser, setPremiumUser] = useReducer(
    (prev: any, next: any) => {
      if (parseInt(next.discount) < 0 || parseInt(next.discount) > 100) {
        return { ...prev, ...next, discount: prev.discount };
      }
      return { ...prev, ...next };
    },
    {
      walletId: "",
      discount: 0,
      action: "new",
      open: false,
    }
  );
  const { addToast } = useToasts();

  const { walletID, role } = useSelector((state: RootState) => state.accountData);

  const navigate = useNavigate();
  useEffect(() => {
    if(role!=="admin"){
      navigate("/")
    }
  }, [role])

  const {
    data,
    error,
    isLoading: loading,
    refetch,
  } = useFetchListUsersPremiumQuery(walletID, {
    skip: walletID === "",
  });

  const [
    saveUserPremium,
    {
      isLoading: isLoadingUpdateUserPremium,
      isSuccess: isSuccessUpdateUserPremium,
    },
  ] = useUpdateUserPremiumMutation();

  useEffect(() => {
    if (!isLoadingUpdateUserPremium && isSuccessUpdateUserPremium) {
      setPremiumUser({ walletId: "", discount: 0, action: "new", open: false });
      addToast("User updated successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      refetch();
    }
  }, [isSuccessUpdateUserPremium, isLoadingUpdateUserPremium]);
  const handleClose = () => {
    setPremiumUser({ open: false });
  };
  const handleSave = () => {
    saveUserPremium({
      walletID,
      userWalletId: premiumUser.walletId,
      discount: premiumUser.discount,
    });
  };
  const columnHelper = createColumnHelper<PremiumUser>();

  const handleSelectUser = useCallback(
    (userSelected: PremiumUser) => {
      setPremiumUser(userSelected);
    },
    [dispatch, navigate]
  );

  const columns = useMemo(
    () => columnsDefinition(columnHelper),
    [columnHelper]
  );
  if ((loading || !data) && !error) {
    return (
      <>
        <div className="container flex flex-col justify-center items-center pt-10">
          {walletID === "" && (
            <h1 className="dark:text-primary text-center font-montserratbold">
              Please connect your wallet
            </h1>
          )}
          <div className="preloader mt-5">
            {" "}
            <span></span>
            <span></span>
          </div>
        </div>
      </>
    );
  }
  if (error) {
    return (
      <div className="container pt-10">
        <h1 className="font-montserratbold text-primary text-center pt-20 pb-20 border-third border-r-0 border-t-0">
          Your session has expired, please refresh your browser.
        </h1>
      </div>
    );
  }
  return (
    <>
      <PremiumUserModal
        open={premiumUser.open}
        handleClose={handleClose}
        handleSave={handleSave}
        handleChange={setPremiumUser}
        premiumUserData={premiumUser}
        loading={isLoadingUpdateUserPremium}
      />
      <PremiumUsersTable
        columns={columns}
        premiumUsers={data as PremiumUser[]}
        handleSelectUser={handleSelectUser}
      />
    </>
  );
};

export default PremiumUsers;
