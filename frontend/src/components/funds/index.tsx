import {
  balanceStyle,
  bottomFormStyle,
  inputStyle,
  buttonStyle,
  labelStyle,
  container
} from "./styles";


const Funds = () => {
  return (
    <div className={container}>
      <div className={balanceStyle}>
        <p className="font-montserratmedium">Total Balance</p>
        <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem]">0 ETH</h3>
      </div>
      <p className="font-montserratmedium mt-[24px]">In order to upload your video, you must
fund your account</p>
      <div className={bottomFormStyle}>
        <p className={`${labelStyle} font-montserratbold tracking-[0.1rem] `}>Fund Account</p>
        <input
          placeholder="amount"
          className={`text-primary ${inputStyle}`}
        />
        <button className={`${buttonStyle} bg-primary`}>
          Send transaction
        </button>
      </div>
    </div>
  );
};

export default Funds;