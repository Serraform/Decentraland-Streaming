/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useCallback, useReducer } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { columnsDefinition } from "components/streams-pull/definitions/columns";
import { PremiumUser } from "components/premium-users/definitions/types";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "store/configStore";

import { RootState } from "store/configStore";
import PremiumUsersTable from "components/premium-users/table";
import PremiumUserModal from "components/premium-users/premium-user";
// import { useFetchAllEndedStreamsQuery } from "store/api/streams.api";
import { useNavigate } from "react-router-dom";
// import { useToasts } from "react-toast-notifications";
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
      walletID: "",
      discount: 0,
      action: "new",
      open: false,
    }
  );
  //   const { addToast } = useToasts();

  const { walletID } = useSelector((state: RootState) => state.accountData);

  const navigate = useNavigate();

  //   const {
  //     data,
  //     error,
  //     isSuccess,
  //     isLoading: loading,
  //     isFetching,
  //   } = useFetchAllEndedStreamsQuery({
  //     skip: walletID === "",
  //   });
  const handleClose = () => {
    setPremiumUser({ open: false });
  };
  const handleSave = () => {
    if (premiumUser.action === "new") {
      // execute addpremiumuser
    } else if (premiumUser.action === "edit") {
      // editpremiumuser
    }
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
  //   if ((loading || !data) && !error)
  if (false) {
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
  // if(error)
  if (false) {
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
      />
      <PremiumUsersTable
        columns={columns}
        premiumUsers={[] as PremiumUser[]}
        handleSelectUser={handleSelectUser}
      />
    </>
  );
};

export default PremiumUsers;
