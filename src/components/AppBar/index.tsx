import React from "react";
import { AppBar, Toolbar, Tabs, Tab, Typography, Box } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const NavbarTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map route paths to tab indices. 
  // If the path doesn't match either, default to false or 0.
  const pathToTabIndex: { [key: string]: number } = {
    "/PendingCustomer": 0,
    "/ComplatedCustomer": 1, // Note: Consider fixing typo to "/CompletedCustomer" if possible
  };

  const currentTab = pathToTabIndex[location.pathname] ?? false;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const routes = ["/PendingCustomer", "/ComplatedCustomer"];
    navigate(routes[newValue]);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#1976d2", boxShadow: 2 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
            🧾 EPF Dashboard
          </Typography>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            aria-label="EPF Dashboard Navigation Tabs"
            sx={{
              "& .MTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
              },
            }}
          >
            <Tab label="Pending EPF Customers" />
            <Tab label="Completed Customers" />
          </Tabs>
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default NavbarTabs;