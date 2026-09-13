import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import CompletedCustomer from "./components/ComplatedCustomer";
import NavbarTabs from "./components/AppBar";
import PendingCustomer from "./components/PendingCustomer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavbarTabs />}>
            
            {/* 1. App open hote hi automatically /PendingCustomer par bhej dega */}
            <Route index element={<Navigate to="PendingCustomer" replace />} />
            
            {/* 2. Nested routes mein aage slash (/) lagane ki zaroorat nahi hoti */}
            <Route path="complatedCustomer" element={<CompletedCustomer />} />
            <Route path="PendingCustomer" element={<PendingCustomer />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;