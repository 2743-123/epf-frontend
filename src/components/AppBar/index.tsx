import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CssBaseline,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const REQUIRED_PASS = "As2743@123";

const NavbarTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("isAppAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === REQUIRED_PASS) {
      sessionStorage.setItem("isAppAuthenticated", "true");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const pathToTabIndex: { [key: string]: number } = {
    "/PendingCustomer": 0,
    "/ComplatedCustomer": 1,
  };

  const currentTab = pathToTabIndex[location.pathname] ?? false;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const routes = ["/PendingCustomer", "/ComplatedCustomer"];
    navigate(routes[newValue]);
  };

  // Password Lock Modal
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f4f6f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CssBaseline />
        <Dialog open={true} disableEscapeKeyDown>
          <Box component="form" onSubmit={handlePasswordSubmit}>
            <DialogTitle sx={{ color: "#111", fontWeight: 600 }}>
              Authentication Required
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2, color: "#555" }}>
                Please enter the password to access the EPF Dashboard.
              </Typography>
              <TextField
                autoFocus
                fullWidth
                type="password"
                label="Password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setError(false);
                }}
                error={error}
                helperText={error ? "Incorrect password. Try again." : ""}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button type="submit" variant="contained" sx={{ bgcolor: "#1976d2" }}>
                Unlock
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    );
  }

  // Dashboard Interface (Light Mode Enforced)
  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        bgcolor: "#f8f9fa", // Force light mode background
        color: "#212529",     // Force standard dark text
      }}
    >
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: "#1976d2", boxShadow: 2 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, letterSpacing: 0.5, color: "#fff" }}>
            🧾 EPF Dashboard
          </Typography>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            aria-label="EPF Dashboard Navigation Tabs"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "rgba(255, 255, 255, 0.85)",
                "&.Mui-selected": {
                  color: "#fff",
                },
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