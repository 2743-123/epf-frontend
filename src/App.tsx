import { BrowserRouter, Route, Routes } from "react-router-dom";

import CompletedCustomer from "./components/ComplatedCustomer";
import NavbarTabs from "./components/AppBar";
import PendingCustomer from "./components/PendingCustomer";
import { useEffect } from "react";

function App() {

const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const refreshData = async () => {
      try {
        // Yahan apni GET API call lagao
        const response = await fetch(`${API_URL}/api/epf/all`);

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        console.log("Data refreshed:", data);

        // Yahan data ko state/context/store me update karo
      } catch (error) {
        console.error("Refresh API error:", error);
      }
    };

    // App load hote hi ek baar API call
    refreshData();

    // Har 14 minute me API call
    const interval = setInterval(() => {
      refreshData();
    }, 14 * 60 * 1000);

    // Component unmount hone par timer remove
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavbarTabs />}>
            <Route path="/complatedCustomer" element={<CompletedCustomer />} />
            <Route
              index
              path="/PendingCustomer"
              element={<PendingCustomer />}
            />

            {/* <Route path="/" element={<EPFDashboard />}> */}
            {/* <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          > */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
