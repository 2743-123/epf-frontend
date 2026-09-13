import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompletedCustomer from "./components/ComplatedCustomer";
import NavbarTabs from "./components/AppBar";
import PendingCustomer from "./components/PendingCustomer";
import { useEffect } from "react";

// Component ke bahar move kiya
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  useEffect(() => {
    const refreshData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/epf/all`);

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        console.log("Data refreshed:", data);
      } catch (error) {
        console.error("Refresh API error:", error);
      }
    };

    refreshData();

    const interval = setInterval(() => {
      refreshData();
    }, 14 * 60 * 1000);

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
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
