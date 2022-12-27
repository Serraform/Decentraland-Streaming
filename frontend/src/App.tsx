/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useEffect } from "react";
import Home from "pages/home";
import Layout from "layout/index";
import { getToken } from "store/services/token.service";
import { ToastProvider } from "react-toast-notifications";
import useConnectWallet from "hooks/useConnectWallet";
import {
  createReactClient,
  studioProvider,
  LivepeerConfig,
} from "@livepeer/react";

function App() {
  const client = createReactClient({
    provider: studioProvider({
      apiKey: "b37fb1af-fde8-437e-8473-5e423eb72500",
    }),
  });
  const { connectWallet } = useConnectWallet();
  const token = localStorage.getItem("token");
  const dontConnectWallet =
    token === "" || token === undefined || token === null;
  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (!dontConnectWallet) {
      connectWallet();
    }
  }, [dontConnectWallet]);
  return (
    <LivepeerConfig client={client}>
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
    </LivepeerConfig>
  );
}

export default App;
