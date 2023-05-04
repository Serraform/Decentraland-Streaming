import Streams from "components/streams";
import Assets from "components/assets";
import StreamsPull from "components/streams-pull";

import UploaderProgress from "components/asset-uploader/uploader-progress";
import { useParams } from 'react-router-dom';


const Home = () => {
  let { listType } = useParams();
  console.log(listType)
  const renderTable = () => {
    switch (listType) {
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
      <div>
        {renderTable()}
        <UploaderProgress />
      </div>
    </>
  );
};

export default Home;
