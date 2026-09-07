import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tooltip,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ConfirmDialog from "./ConfirmDialogBox";
import { Customer } from "./Types";

const PendingCustomer: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [filteredData, setFilteredData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewText, setViewText] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/epf/all`);
      const result = await res.json();

      const pending = result.filter((r: Customer) => {
        const ws = r.workStatus?.toLowerCase() || "";
        return ws === "pending" || ws === "updated" || ws === "in progress";
      });

      setData(pending);
      setFilteredData(pending);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filtered = data.filter(
      (cust) =>
        cust.name?.toLowerCase().includes(lower) ||
        cust.uanNumber?.toLowerCase().includes(lower) ||
        cust.aadharCardName?.toLowerCase().includes(lower)
    );
    setFilteredData(filtered);
  }, [search, data]);

  const handleOpenConfirm = (cust: Customer) => {
    setSelectedCustomer({ ...cust });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
  };

  const handleViewUpdatedStatus = (text: string) => {
    setViewText(text || "No details available");
    setOpenViewDialog(true);
  };

  // 📋 Universal Copy Handler for ANY field
  const handleCopy = (text: string | null | undefined, label: string) => {
    if (!text || text === "—") return;
    navigator.clipboard.writeText(text);
    setCopyMessage(`${label} copied to clipboard!`);
    setSnackbarOpen(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          gap: 2.5,
        }}
      >
        <CircularProgress thickness={4} size={48} sx={{ color: "#3b82f6" }} />
        <Typography sx={{ color: "text.secondary", fontWeight: 500, letterSpacing: 0.5 }}>
          Loading pending queue...
        </Typography>
      </Box>
    );
  }

  const clickableStyle = {
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "primary.main",
      backgroundColor: "rgba(37, 99, 235, 0.04)",
      borderRadius: "4px",
    },
    display: "inline-block",
    px: 0.5,
    py: 0.25,
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1600, mx: "auto" }}>
        {/* Top Header Card */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 3,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
              Pending EPF Customers
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Click on <strong>any cell value</strong> (Name, UAN, Aadhaar, Mobile, Bank, IFSC, etc.) to copy it instantly.
            </Typography>
          </Box>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Search Name, UAN, Aadhar Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              minWidth: 300,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "grey.50",
                "&:hover fieldset": { borderColor: "primary.main" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Data Table Container */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.02)",
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 1600 }}>
            <TableHead sx={{ backgroundColor: "grey.50" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Customer Name 📋</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>UAN Number 📋</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>UAN Password 📋</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Aadhar Number 📋</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Aadhar Card Name 📋</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>DOB 📋</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Aadhar Mobile 📋</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Bank A/C No. 📋</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>IFSC Code 📋</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Commission</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Paid Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Work Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Updated Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", pr: 4 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((cust) => {
                  const status = cust.workStatus?.toLowerCase() || "";
                  
                  let chipBg = "rgba(107, 114, 128, 0.08)";
                  let chipColor = "#4b5563";
                  let IconComponent = PendingActionsIcon;

                  if (status === "updated") {
                    chipBg = "rgba(14, 165, 233, 0.08)";
                    chipColor = "#0284c7";
                    IconComponent = InfoOutlinedIcon;
                  } else if (status === "in progress") {
                    chipBg = "rgba(245, 158, 11, 0.08)";
                    chipColor = "#d97706";
                    IconComponent = PendingActionsIcon;
                  }

                  return (
                    <TableRow
                      key={cust.id}
                      sx={{
                        transition: "background-color 0.2s",
                        "&:hover": { backgroundColor: "rgba(37, 99, 235, 0.015)" },
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500, color: "text.secondary" }}>#{cust.id}</TableCell>
                      
                      {/* Name */}
                      <TableCell>
                        <Tooltip title="Click to copy Name" arrow>
                          <Box component="span" onClick={() => handleCopy(cust.name, "Customer Name")} sx={clickableStyle}>
                            {cust.name || "—"}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* UAN */}
                      <TableCell>
                        <Tooltip title="Click to copy UAN" arrow>
                          <Box component="span" onClick={() => handleCopy(cust.uanNumber, "UAN Number")} sx={{ ...clickableStyle, fontFamily: "monospace" }}>
                            {cust.uanNumber || "—"}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* UAN Password */}
                      <TableCell>
                        <Tooltip title="Click to copy Password" arrow>
                          <Box component="span" onClick={() => handleCopy(cust.uanPassword, "UAN Password")} sx={{ ...clickableStyle, fontFamily: "monospace" }}>
                            {cust.uanPassword || "—"}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* Aadhar Number (Will copy actual number when clicked as requested) */}
                      <TableCell>
                        <Tooltip title="Click to copy Aadhar Number" arrow>
                          <Box component="span" onClick={() => handleCopy(cust.aadharNumber, "Aadhar Number")} sx={{ ...clickableStyle, fontFamily: "monospace" }}>
                            {cust.aadharNumber || "—"}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* Aadhar Card Name */}
                      <TableCell>
                        <Tooltip title="Click to copy Aadhar Name" arrow>
                          <Box component="span" onClick={() => handleCopy(cust.aadharCardName, "Aadhar Card Name")} sx={clickableStyle}>
                            {cust.aadharCardName || "—"}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* DOB */}
                      <TableCell>
                        <Tooltip title="Click to copy DOB" arrow>
                          <Box component="span" onClick={() => handleCopy(cust.dob, "Date of Birth")} sx={clickableStyle}>
                            {cust.dob || "—"}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* Mobile */}
                      <TableCell>
                        <Tooltip title="Click to copy Mobile" arrow>
                          <Box component="span" onClick={() => handleCopy(cust.aadharMobile, "Aadhar Mobile")} sx={{ ...clickableStyle, fontFamily: "monospace" }}>
                            {cust.aadharMobile || "—"}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* Bank A/C No */}
                      <TableCell>
                        <Tooltip title="Click to copy Account No." arrow>
                          <Box component="span" onClick={() => handleCopy(cust.bankAccountNumber, "Bank Account Number")} sx={{ ...clickableStyle, fontFamily: "monospace" }}>
                            {cust.bankAccountNumber || "—"}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* IFSC Code */}
                      <TableCell>
                        <Tooltip title="Click to copy IFSC" arrow>
                          <Box component="span" onClick={() => handleCopy(cust.ifscCode, "IFSC Code")} sx={{ ...clickableStyle, fontFamily: "monospace" }}>
                            {cust.ifscCode || "—"}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      <TableCell sx={{ color: "text.secondary" }}>
                        {cust.commissionAmount != null ? `₹${cust.commissionAmount.toLocaleString()}` : "—"}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                        {cust.paidAmount != null ? `₹${cust.paidAmount.toLocaleString()}` : "—"}
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={<IconComponent style={{ fontSize: 14, color: chipColor }} />}
                          label={cust.workStatus || "Pending"}
                          size="small"
                          sx={{
                            backgroundColor: chipBg,
                            color: chipColor,
                            fontWeight: 600,
                            borderRadius: 1.5,
                            px: 0.5,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {cust.updatedStatus ? (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityIcon fontSize="small" />}
                            onClick={() => handleViewUpdatedStatus(cust.updatedStatus)}
                            sx={{
                              textTransform: "none",
                              fontWeight: 500,
                              borderRadius: 2,
                              borderColor: "divider",
                              color: "text.primary",
                              "&:hover": { bgcolor: "action.hover", borderColor: "primary.main" },
                            }}
                          >
                            View Notes
                          </Button>
                        ) : (
                          <Typography sx={{ color: "text.disabled" }}>—</Typography>
                        )}
                      </TableCell>

                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Tooltip title="Review and confirm customer workflow" arrow>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            disableElevation
                            startIcon={<CheckCircleIcon fontSize="small" />}
                            onClick={() => handleOpenConfirm(cust)}
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                              borderRadius: 2,
                              px: 2,
                              bgcolor: "#16a34a",
                              "&:hover": { bgcolor: "#15803d" },
                            }}
                          >
                            Confirm
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={15} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      No pending customers found matching your criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedCustomer && (
          <ConfirmDialog
            open={openDialog}
            onClose={handleCloseDialog}
            customer={selectedCustomer}
            onUpdated={fetchData}
          />
        )}

        {/* View Updated Status Modal */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            📝 Work Notes & Status Log
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: "divider" }}>
            <Box
              sx={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                bgcolor: "grey.50",
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                minHeight: "140px",
                fontSize: "0.9rem",
                color: "text.primary",
              }}
            >
              {viewText}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setOpenViewDialog(false)}
              variant="contained"
              disableElevation
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Snackbar Alert for Copy Feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%", borderRadius: 2, fontWeight: 500 }}
          >
            {copyMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default PendingCustomer;