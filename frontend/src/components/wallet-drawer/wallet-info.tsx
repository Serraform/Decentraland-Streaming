// import Funds from "../Funds";
import React from "react";
import MetaMaskIcon from "assets/icons/Metamask";
import Funds from 'components/funds'
type Prop = {
  walletID: string;
};
const WalletInfo: React.FC<Prop> = ({ walletID }) => {
  return (
    <div>
      <span className="flex flex-row justify-between items-center p-[20px] text-[#bdbdbd]">
        <div >
          <MetaMaskIcon />
        </div>
        {walletID.slice(0, 6)}...
        {walletID.slice(walletID.length - 4, walletID.length)}
      </span>
      <Funds />

    </div>
  );
};

export default WalletInfo;
