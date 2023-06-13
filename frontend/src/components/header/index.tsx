/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import WalletIcon from "assets/icons/Wallet";
import WalletDrawer from "components/wallet-drawer";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
import FaqIcon from "assets/icons/Docs"
const Header = () => {
  const { walletID, avatar, isPremium } = useSelector(
    (state: RootState) => state.accountData
  );
  useEffect(() => {
    if (avatar) {
      (document.getElementById("#jazzicon") as any).appendChild(avatar);
    }
  }, [avatar !== undefined]);
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <div className="border-b dark:border-[#323739] ">
      <div className="container  flex flex-row justify-end items-center pt-[10px] pb-[10px] pr-[30px]">
        <WalletDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
       
        {walletID !== "" && avatar ? (
          <div className="flex flex-row items-center">
            <a
               href="https://serraform.gitbook.io/streaming-docs/"
               target="_blank"
              data-for="faq"
              data-tip={"Manual"}
              data-iscapture="true"
              type="button"
              className="mr-2 docs"
              aria-haspopup="true"
              aria-expanded="false"
              data-headlessui-state=""
              aria-labelledby="headlessui-listbox-label-3 headlessui-listbox-button-4" rel="noreferrer"
            >
              <FaqIcon />
            </a>
            <button
              className={`border-2 rounded-full p-[0.2rem] ${isPremium ? "border-orange-300" : "border-primary"} flex justify-center items-center flex-row`}
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
