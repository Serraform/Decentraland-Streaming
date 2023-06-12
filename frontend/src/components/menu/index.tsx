import { Link } from "react-router-dom";
import StreamsIcon from "assets/icons/Streams";
import VideoIcon from "assets/icons/Videos";
import TwitterIcon from "assets/icons/LogoTwitter";
import GithubIcon from "assets/icons/Github";
import LinkedinIcon from "assets/icons/Linkedin";
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
        <span>Video Assets</span>{" "}
      </Link>
      {role === "admin" && (
        <>
          {" "}
          <Link to="/streams-to-pull" className={`${listType==="streams-to-pull" && `active` }  ${role === "admin" && "gold"}`}>
            <TransferIcon />
            <span>Streams to pull</span>
          </Link>
          <Link to="/premium-users" className={`${listType==="premium-users" && `active`} ${role === "admin" && "gold"} ` }>
            <UserPremium />
            <span>Premium Users</span>{" "}
          </Link>
        </>
      )}
      <div className="flex flex-row mt-auto justify-evenly docs">
        <a href="https://twitter.com/Serraform4" target="_blank" className="flex flex-row justify-between items-center" rel="noreferrer">
          <TwitterIcon />
        </a>
        &#x2022;
        <a href="https://github.com/Serraform/Decentraland-Streaming" target="_blank" className="flex flex-row justify-between items-center" rel="noreferrer">
          <GithubIcon />
          
        </a>
       &#x2022;
        <a href="https://www.linkedin.com/company/serraform/" target="_blank" className="flex flex-row justify-between items-center" rel="noreferrer">
          <LinkedinIcon />
        </a>
      </div>
    </div>
  );
};

export default Menu;
