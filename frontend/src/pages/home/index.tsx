import Banner from "components/home/banner";
import Streams from "components/streams";
import StreamModal from "components/stream";
import { RootState } from "store/configStore";
import { handleOpenModal, handleCloseModal } from "store/slices/stream.slice";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
const Home = () => {
  const { selectedStream, openModal, isNewStream } = useSelector(
    (state: RootState) => state.streamData
  );
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const openModalAction = () => {
    
    dispatch(handleOpenModal())
  }
  const closeModalAction = () => {
    dispatch(handleCloseModal())
  }
  
  return (
    <>
      <StreamModal
        open={openModal}
        close={closeModalAction}
        isNewStream={isNewStream}
        selectedStream={selectedStream}
      />
      <Banner openNewStream={openModalAction} walletID={walletID} />
      <Streams />
    </>
  );
};

export default Home;
