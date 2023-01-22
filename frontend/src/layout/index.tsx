import React, { Fragment } from "react";
import Header from "components/header";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { clearSelectStream } from "store/slices/stream.slice";
type Props = {
  children: JSX.Element;
};
const Layout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  const useAppDispatch = () => useDispatch<AppDispatch>();

  const dispatch = useAppDispatch();
  
  const handleOpenNewStream = () => {
    dispatch(clearSelectStream());
    navigate("/stream/new");
  };

  return (
    <Fragment>
      <Header openNewStream={handleOpenNewStream} />
      {children}
    </Fragment>
  );
};

export default Layout;
