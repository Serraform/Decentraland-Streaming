import React, { Suspense } from "react";
import Home from "pages/home";
import Layout from "layout/index";

import { ToastProvider } from "react-toast-notifications";
import useConnectWallet from "hooks/useConnectWallet";
function App() {
  useConnectWallet();
  return (
    <ToastProvider placement="bottom-center">
      <Suspense
        fallback={
          <div className="preloader-wrapper">
            <div className="preloader">
              <span></span>
              <span></span>
            </div>
          </div>
        }
      >
        <Layout>
          <Home />
        </Layout>
      </Suspense>
    </ToastProvider>
  );
}

export default App;