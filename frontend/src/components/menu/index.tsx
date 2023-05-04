import { Link } from "react-router-dom";
import StreamsIcon from "assets/icons/Streams";
import VideoIcon from "assets/icons/Videos";
import TransferIcon from "assets/icons/StreamsPull";
import UserPremium from "assets/icons/Premium";
import useConnectWallet from "hooks/useConnectWallet";
import { useParams } from 'react-router-dom';
const Menu = () => {
  const {  role } = useConnectWallet();
    let { listType } = useParams();
  return (
    <div className="  menu">
      <div className=" pt-[20px]  pb-[20px] pr-[20px]">
        <img
          src={"/images/logo/logo.svg"}
          className="object-contain"
          alt="logo"
        />
      </div>
      <Link to="/streams" className={`${listType==="streams" && `active`}`}>
        <StreamsIcon />
        <span>Streams</span>
      </Link>
      <Link to="/assets" className={`${listType==="assets" && `active`}`}>
        {" "}
        <VideoIcon />
        <span>Video files</span>{" "}
      </Link>
      {role === "admin" && (
        <>
          {" "}
          <Link to="/streams-to-pull" className={`${listType==="streams-to-pull" && `active` }  ${role === "admin" && "gold"}`}>
            <TransferIcon />
            <span>Streams to pull</span>
          </Link>
          <Link to="/premium-user" className={`${listType==="premium-user" && `active`} ${role === "admin" && "gold"} ` }>
            <UserPremium />
            <span>Premium Users</span>{" "}
          </Link>
        </>
      )}
    </div>
  );
};

export default Menu;
