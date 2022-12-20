import React, { Suspense, useEffect } from "react";
import Home from "pages/home";
import Layout from "layout/index";
import { getToken } from "store/services/token.service";
import { ToastProvider } from "react-toast-notifications";
import useConnectWallet from "hooks/useConnectWallet";
function App() {
  useConnectWallet();
  useEffect(() => {
    getToken();
    // localStorage.setItem("jwt", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJhcGk6Ly9mYTNkYzhkNC05NWM0LTQ1MDMtOTNjYi0xNzRmMjZhOTM3ODciLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9iOGZjZDc2NC01NjdmLTQ0MGQtOGM3YS02MjE4ZGFjOTZjMTAvIiwiaWF0IjoxNjcxNDgzNjk4LCJuYmYiOjE2NzE0ODM2OTgsImV4cCI6MTY3MTQ4NzU5OCwiYWlvIjoiRTJaZ1lOZ3RQVEhIVkp6QjZScDc5aE9tcnA2SkFBPT0iLCJhcHBpZCI6IjVhZWNlZDIyLWI4MjAtNDk4NC1iMDNhLWRjODAwNDA1YmI2ZiIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2I4ZmNkNzY0LTU2N2YtNDQwZC04YzdhLTYyMThkYWM5NmMxMC8iLCJvaWQiOiI2NTk3NzFjZi03MjdjLTQ5MTctYTgzMi1lMzg1ZmY2OTcyYWMiLCJyaCI6IjAuQVVZQVpOZjh1SDlXRFVTTWVtSVkyc2xzRU5USVBmckVsUU5GazhzWFR5YXBONGVBQUFBLiIsInJvbGVzIjpbIkZpbGVVcGxvYWQiXSwic3ViIjoiNjU5NzcxY2YtNzI3Yy00OTE3LWE4MzItZTM4NWZmNjk3MmFjIiwidGlkIjoiYjhmY2Q3NjQtNTY3Zi00NDBkLThjN2EtNjIxOGRhYzk2YzEwIiwidXRpIjoiejlGOS1TcmZfMFc3bndTSjBWWjhBUSIsInZlciI6IjEuMCJ9.Vbo2LNtilAI1RreLCvMgXc6IUWrwKuRERTArfsFiNXmPSHfFkBDjcc89Q1bnCAsHYsXYCxHZt7Oh551teJmr_wfno_kRtqvs0j_2BciwbYfl3mtoRWrJGi7KR4xwJvhVRHdCF1tf0DfOCkWuiaCEGlFpz5kKGZoLmoREMjGfwZA9nGLKERaJ83Rs-CPFWdZPh8ga3_2Xm_OzX2D_yb1FqCeLTR4GOiTU2iXb1zqYGBax1eht5DOcgTNTUtSNDfgXuZWQYevyqU9zDnd2oBD1-chTKM2cZss2_s5ywxnsGwJRweH8CSEK6q45u0V2ckOnRtED9MyNkUx5vGJu9PYl1w")
  }, []);
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
