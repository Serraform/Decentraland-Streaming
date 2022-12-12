import React, {useState} from "react";
import Banner from 'components/home/banner'
import Streams from 'components/streams';
import StreamModal from 'components/stream-modal';
const Home = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  return (
    <>
    <StreamModal open={modalIsOpen} close={handleClose} isNewStream={true} />
      <Banner openNewStream={handleOpen} />
      <Streams />
    </>
  );
};

export default Home;
