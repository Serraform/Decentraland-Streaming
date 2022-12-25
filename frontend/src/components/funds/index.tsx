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
      <div className={`${balanceStyle} rounded`}>
        <p className="font-montserratmedium">Total Balance</p>
        <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem]">0 USDT</h3>
      </div>
      <p className="font-montserratmedium mt-[24px]">In order to upload your video, you must
fund your account</p>
      <div className={bottomFormStyle}>
        <p className={`${labelStyle} font-montserratbold tracking-[0.1rem] `}>Fund Account</p>
        <input
          placeholder="amount"
          className={`text-primary ${inputStyle} rounded rounded-b-none`}
        />
        <button className={`${buttonStyle} bg-primary rounded rounded-t-none`}>
          Send transaction
        </button>
      {/* <button className="btn-third" style={{ paddingLeft: 0}} onClick={async () => {
         const { ethereum } = window as any;
         if (!ethereum) {
           return;
         }
     
         const accounts = await ethereum.request({
           method: "eth_requestAccounts",
         });
      }}>Log out</button> */}
      </div>

    </div>
  );
};

export default Funds;