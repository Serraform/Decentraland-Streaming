import Streams from "components/streams";
import StreamModal from "components/stream";
import { RootState } from "store/configStore";
import {   handleCloseModal } from "store/slices/stream.slice";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
const Home = () => {
  const { selectedStream, openModal, isNewStream } = useSelector(
    (state: RootState) => state.streamData
  );
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();


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
      <Streams />
    </>
  );
};

export default Home;
