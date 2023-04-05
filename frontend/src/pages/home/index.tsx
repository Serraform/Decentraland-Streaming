import Streams from "components/streams";
import Assets from "components/assets";
import StreamsPull from "components/streams-pull";
import { useReducer } from "react";
import useConnectWallet from "hooks/useConnectWallet";
import UploaderProgress from "components/asset-uploader/uploader-progress";
type LIST_TYPE = "streams" | "assets" | "streams-to-pull";

const Home = () => {
  const { walletID, role } = useConnectWallet();
  const [list, setList] = useReducer(
    (prev: any, next: any) => {
      const newEvent = { ...prev, ...next };
      return newEvent;
    },
    {
      type: "streams" as LIST_TYPE,
    }
  );

  const handleChangeType = (event: any) => {
    setList({ [event.target.name]: event.target.value });
  };
  const renderTable = () => {
    switch (list.type) {
      case "streams":
        return <Streams />;
      case "assets":
        return <Assets />;
      case "streams-to-pull":
        return <StreamsPull />;
      default:
        return <Streams />;
    }
  };
  return (
    <>
      <div className="container pt-10 flex flex-row justify-end">
        {walletID && "" && <form>
          {role === "admin" && (
            <label className="mr-2 font-montserratregular text-black  dark:text-white ">
              <input
                type="radio"
                className="mr-1"
                name="type"
                value="streams-to-pull"
                checked={list.type === "streams-to-pull"}
                onClick={(e) => handleChangeType(e)}
              />
              Streams to pull
            </label>
          )}
          <label className="mr-2 font-montserratregular text-black  dark:text-white ">
            <input
              type="radio"
              className="mr-1"
              name="type"
              value="streams"
              checked={list.type === "streams"}
              onClick={(e) => handleChangeType(e)}
            />
            Streams
          </label>
          <label className="ml-2 font-montserratregular text-black  dark:text-white ">
            <input
              type="radio"
              className="mr-1"
              name="type"
              value="assets"
              checked={list.type === "assets"}
              onClick={(e) => handleChangeType(e)}
            />
            Assets
          </label>
        </form>}
      </div>
      {renderTable()}
      <UploaderProgress />
    </>
  );
};

export default Home;