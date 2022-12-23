import React, { Fragment } from "react";
import Header from "components/header";
import { handleOpenModal } from "store/slices/stream.slice";
import {  useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
type Props = {
  children: JSX.Element;
};
const Layout: React.FC<Props> = ({ children }) => {
 
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const openModalAction = () => {
    dispatch(handleOpenModal())
  }
 
  return (
    <Fragment>
      <Header openNewStream={openModalAction}/>
      {children}
    </Fragment>
  );
};

export default Layout;
