import { Link } from "react-router-dom";
import StreamsIcon from "assets/icons/Streams";
import VideoIcon from "assets/icons/Videos";
import TransferIcon from "assets/icons/StreamsPull";
import UserPremium from "assets/icons/Premium";
import useConnectWallet from "hooks/useConnectWallet";
const Menu = () => {
  const {  role } = useConnectWallet();
  return (
    <div className="  menu">
      <div className=" pt-[20px]  pb-[20px] pr-[20px]">
        <img
          src={"/images/logo/logo.svg"}
          className="object-contain"
          alt="logo"
        />
      </div>
      <Link to="/streams">
        <StreamsIcon />
        <span>Streams</span>
      </Link>
      <Link to="/assets">
        {" "}
        <VideoIcon />
        <span>Video files</span>{" "}
      </Link>
      {role === "admin" && (
        <>
          {" "}
          <Link to="/streams-to-pull">
            <TransferIcon />
            <span>Streams to pull</span>
          </Link>
          <Link to="/premium-user">
            <UserPremium />
            <span>Premium Users</span>{" "}
          </Link>
        </>
      )}
    </div>
  );
};

export default Menu;
