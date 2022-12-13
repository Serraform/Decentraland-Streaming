import React, { useState } from "react";
import WalletIcon from "assets/icons/Wallet";
import WalletDrawer from "components/wallet-drawer";
const Header: React.FunctionComponent = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <div className="container flex flex-row justify-between items-center pt-[10px] pb-[10px]">
      <WalletDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
      />
      <img
        src={"/images/logo/logo.png"}
        className="object-contain"
        alt="logo"
      />
      <button onClick={() => setOpenDrawer(true)}>
        <WalletIcon />
      </button>
    </div>
  );
};

export default Header;
