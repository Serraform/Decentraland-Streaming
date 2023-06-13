import ConnectWallet from "components/wallet-drawer/connect-wallet";
import WalletInfo from "components/wallet-drawer/wallet-info";
import React from "react";
import ProfileIcon from "assets/icons/Profile";
import CloseIcon from "assets/icons/Close";
import useConnectWallet from "hooks/useConnectWallet";
import DarkModeIcon from "assets/icons/Dark";
import LightModeIcon from "assets/icons/Light";
import FaqIcon from "assets/icons/Question";
import ReactTooltip from "react-tooltip";
type Props = {
  openDrawer: boolean;
  setOpenDrawer: (state: boolean) => void;
};

const WalletDrawer: React.FC<Props> = ({ openDrawer, setOpenDrawer }) => {
  const { walletID, connectWallet, role } = useConnectWallet();
  return (
    <div
      className="wallet-drawer"
      style={{
        transform: openDrawer ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <div className="border-b border-[#e5e8eb] p-[20px] dark:border-[#323739]">
        <span className="flex flex-row justify-between">
          <div className="flex flex-row items-center ">
            <div>
              <ProfileIcon />
            </div>
            <div className="ml-2">
              <span className="font-montserratbold tracking-[0.1rem] dark:text-white">
                {role === "admin" ? "My Admin Serraform Account" : "My Serraform Account"}
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center">
          <ReactTooltip
              id="faq"
              place="top"
              type={"dark"}
              effect={"float"}
            />
            <a
               href="https://serraform.gitbook.io/streaming-docs/faq"
               target="_blank"
              data-for="faq"
              data-tip={"FAQ"}
              data-iscapture="true"
              type="button"
              className="mr-2"
              aria-haspopup="true"
              aria-expanded="false"
              data-headlessui-state=""
              aria-labelledby="headlessui-listbox-label-3 headlessui-listbox-button-4" rel="noreferrer"
            >
              <FaqIcon />
            </a>
            <ReactTooltip
              id="view-mode"
              place="top"
              type={"dark"}
              effect={"float"}
            />
            <button
              data-for="view-mode"
              data-tip={"Change view mode"}
              data-iscapture="true"
              type="button"
              className="mr-2"
              aria-haspopup="true"
              aria-expanded="false"
              data-headlessui-state=""
              aria-labelledby="headlessui-listbox-label-3 headlessui-listbox-button-4"
            >
              <span
                className="dark:hidden"
                onClick={() => {
                  const root = window.document.documentElement;
                  root.classList.remove("light");
                  root.classList.add("dark");
                  localStorage.setItem("theme", "dark");
                }}
              >
                <LightModeIcon />
              </span>
              <span
                className="hidden dark:inline"
                onClick={() => {
                  const root = window.document.documentElement;
                  root.classList.remove("dark");
                  root.classList.add("light");
                  localStorage.setItem("theme", "light");
                }}
              >
                <DarkModeIcon />
              </span>
            </button>

            <button onClick={() => setOpenDrawer(false)}>
              <CloseIcon />
            </button>
          </div>
        </span>
      </div>
      {!walletID ? (
        <ConnectWallet requestConnectWallet={connectWallet} />
      ) : (
        <WalletInfo walletID={walletID} />
      )}
    </div>
  );
};

export default WalletDrawer;
