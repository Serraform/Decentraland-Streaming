/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useEffect } from "react";
import Home from "pages/home";
import Stream from "pages/stream";
import Layout from "layout/index";
import { ToastProvider } from "react-toast-notifications";
import useConnectWallet from "hooks/useConnectWallet";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
function App() {
  const { connectWallet, fetchAccountData, fetchTreasuryData, role, walletID } =
    useConnectWallet();
  const token = localStorage.getItem("token");
  const theme = localStorage.getItem("theme");
  const dontConnectWallet =
    token === "" || token === undefined || token === null;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add(theme as string);
  }, []);

  useEffect(() => {
    fetchAccountData();
  }, [walletID]);
  useEffect(() => {
    fetchTreasuryData();
  }, [walletID, role]);

  useEffect(() => {
    if (!dontConnectWallet) {
      connectWallet();
    }
  }, [dontConnectWallet]);

  useEffect(() => {
    const interval = setInterval(() => {
      connectWallet(); // Call your function here
    }, 5 * 60000); // Convert minutes to milliseconds

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
    },
    {
      path: "*",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
    },
    {
      path: "/:listType",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
    },
    {
      path: "/stream/:id",
      element: (
        <Layout>
          <Stream />
        </Layout>
      ),
    },
  ]);

  return (
    <ToastProvider placement="bottom-center">
      <Suspense
        fallback={
          <>
            <h1>Please connect your wallet</h1>
            <div className="preloader-wrapper">
              <div className="preloader">
                <span></span>
                <span></span>
              </div>
            </div>
          </>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ToastProvider>
  );
}

export default App;
