/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import WalletIcon from "assets/icons/Wallet";
import WalletDrawer from "components/wallet-drawer";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
type Props = {
  openNewStream: Function;
};
const Header: React.FC<Props> = ({ openNewStream }) => {
  const { walletID, avatar } = useSelector(
    (state: RootState) => state.accountData
  );
  useEffect(() => {
    if (avatar) {
      (document.getElementById("#jazzicon") as any).appendChild(avatar);
    }
  }, [avatar !== undefined]);
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <div className="border-b dark:border-[#323739]">
      <div className="container  flex flex-row justify-between items-center pt-[10px] pb-[10px]">
        <WalletDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        <img
          src={"/images/logo/logo.svg"}
          className="object-contain"
          alt="logo"
        />
        {walletID !== "" && avatar ? (
          <div className="flex flex-row">
            <button
              onClick={() => openNewStream()}
              disabled={walletID === ""}
              className="btn-third"
            >
              Schedule new stream
            </button>
            <button
              className="border-2 rounded-full p-[0.2rem] border-primary flex justify-center items-center flex-row"
              onClick={() => setOpenDrawer(true)}
            >
              <div id="#jazzicon" className="flex" />
            </button>
          </div>
        ) : (
          <button onClick={() => setOpenDrawer(true)}>
            <WalletIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
