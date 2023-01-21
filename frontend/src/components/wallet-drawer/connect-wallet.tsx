import React from "react";
import MetaMaskIcon from "assets/icons/Metamask";

type Prop = {
  requestConnectWallet: () => void;
};
const ConnectWallet: React.FC<Prop> = ({ requestConnectWallet }) => {
  return (
    <div className=" p-[20px]">
      <div className="flex flex-col items-start">
        <span className="font-montserratregular tracking-[0.1rem] text-[1rem] dark:text-white">
          Connect with one of our available wallet providers or create a new
          one.
        </span>
        <div className="w-[100%]    mb-[72px] mt-[24px]">
          <ul className="wallet-list">
            <li className="wallet-item">
              <button
                className="wallet-option"
                type="button"
                onClick={requestConnectWallet}
              >
                <div>
                  <MetaMaskIcon />
                </div>
                <div>
                  <span>MetaMask</span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
