import ConnectWallet from "components/wallet-drawer/connect-wallet";
import WalletInfo from "components/wallet-drawer/wallet-info";
import React from "react";
import ProfileIcon from "assets/icons/Profile";
import CloseIcon from "assets/icons/Close";
import useConnectWallet from "hooks/useConnectWallet";
type Props = {
  openDrawer: boolean;
  setOpenDrawer: (state: boolean) => void;
};

const WalletDrawer: React.FC<Props> = ({ openDrawer, setOpenDrawer }) => {
  const { walletID, connectWallet } = useConnectWallet();
  return (
    <div
      className="wallet-drawer"
      style={{
        transform: openDrawer ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <div className="border-b border-[#e5e8eb] p-[20px]">
        <span className="flex flex-row justify-between">
          <div className="flex flex-row items-center ">
            <div>
              <ProfileIcon />
            </div>
            <div className="ml-2">
              <span className="font-montserratbold tracking-[0.1rem]">
                My wallet
              </span>
            </div>
          </div>
          <button onClick={() => setOpenDrawer(false)}>
            <CloseIcon />
          </button>
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
