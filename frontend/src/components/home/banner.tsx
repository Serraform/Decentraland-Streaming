type Props = {
  openNewStream: () => void;
  walletID: string;
};

const Banner: React.FC<Props> = ({ openNewStream, walletID }) => {
  return (
    <div className="  background-banner pt-[40px] pb-[40px]">
      <div className="container flex flex-row justify-between items-center">
        <h1 className="text-white font-montserratbold text-xl">
          Start streaming to DECENTRALAND here
        </h1>
        <button onClick={openNewStream} disabled={walletID === ""} className="btn-primary">
          Add new stream
        </button>
      </div>
    </div>
  );
};

export default Banner;
