import React, { Fragment } from "react";
import Header from "components/header";
type Props = {
  children: JSX.Element;
};
const Layout: React.FC<Props> = ({ children }) => {

  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
};

export default Layout;
