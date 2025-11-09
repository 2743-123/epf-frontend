import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CompletedCustomer from "./components/ComplatedCustomer";
import NavbarTabs from "./components/AppBar";
import PendingCustomer from "./components/PendingCustomer";

function App() {
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
