import { css } from "@emotion/css";
export const balanceStyle = css`
  border: 1px solid rgb(229, 232, 235);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top:0.5rem;
  padding-bottom:0.5rem;
  .lock-funds{
    display: block;
    transition: all 0.5s ease-in-out;
  }
  .read-more{
    display: none;
    transition: all 0.5s ease-in-out;
  }
  height: 80px;
  &:hover{
    cursor:pointer;
    .locked-funds {
      display: none;
    }
    .read-more{
      visibility: visible;
      display: block;
    
    }
  }
`;

export const container = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 0px 0px;
`;
export const bottomFormStyle = css`
  ${formStyle};
  margin-bottom: 35px;
`;

export const inputStyle = css`
  padding: 12px 20px;
  font-family: Montserratbold;
  outline: none;
  background-color: rgba(0, 0, 0, 0.08);
  width: 100%;
`;


export const buttonStyle = css`
  color: white;
  padding: 12px 40px;
  border: none;
  font-weight: 700;
  width: 100%;
  transition: all 0.35s;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.75);
  }
`;

export const labelStyle = css`
  margin: 0px 0px 5px;
`;