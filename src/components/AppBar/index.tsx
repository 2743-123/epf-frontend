import React, { useState } from "react";
import { AppBar, Toolbar, Tabs, Tab, Typography, Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const NavbarTabs: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = (_: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const navigate = useNavigate();
  const redirect = (url: string): void => {
    navigate(url);
  };
  return (
    <Box>
      {/* 🔹 AppBar with Tabs */}
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🧾 EPF Dashboard
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab
              onClick={() => redirect("/PendingCustomer")}
              label="Pending EPF Customers"
            />
            <Tab
              onClick={() => redirect("/ComplatedCustomer")}
              label="Completed Customers"
            />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
};

export default NavbarTabs;
