import React, { Fragment } from "react";
import Header from "components/header";
import Menu from 'components/menu'
type Props = {
  children: JSX.Element;
};
const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Fragment>
      <div className="flex flex-row">
        <Menu />
        <div className="w-full">
          <Header />
          {children}
        </div>
      </div>
    </Fragment>
  );
};

export default Layout;
