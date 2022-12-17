import { useState } from "react";
import Banner from "components/home/banner";
import Streams from "components/streams";
import StreamModal from "components/stream";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
const Home = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { selectedStream } = useSelector(
    (state: RootState) => state.streamData
  );
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
      <StreamModal
        open={modalIsOpen}
        close={handleClose}
        isNewStream={true}
        selectedStream={selectedStream}
      />
      <Banner openNewStream={handleOpen} />
      <Streams />
    </>
  );
};

export default Home;
