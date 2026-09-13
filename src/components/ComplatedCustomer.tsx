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
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Fade,
  Collapse,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import AddCustomerDialog from "./AddCustomerDialog";
import Swal from "sweetalert2";

interface Customer {
  id: number;
  name: string;
  aadharCardName: string;
  uanNumber: string;
  aadharNumber: string | null;
  dob: string;
  aadharMobile: string | null;
  uanPassword: string | null;
  workStatus: string;
  updatedStatus: string | null;
  bankAccountNumber: string | null;
  ifscCode: string | null;
  commissionAmount: number | null;
  paidAmount: number;
  createDate: string;
  updateDate: string;
  confirmDate: string;
}

// =========================================================
// HELPER: Date Formatter
// =========================================================
const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return "—";
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return dateString;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

// =========================================================
// SUB-COMPONENT: Expandable Row (Scrollable Edition)
// =========================================================
const CustomerRow = ({
  cust,
  handleCopy,
  handleDelete,
  handleReopen,
  handleViewUpdatedStatus
}: {
  cust: Customer;
  handleCopy: (text: string | null | undefined, label: string) => void;
  handleDelete: (id: number) => void;
  handleReopen: (id: number) => void;
  handleViewUpdatedStatus: (text: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const DetailItem = ({ label, value, fieldName }: { label: string; value: any; fieldName: string }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: value && value !== "—" ? "text.primary" : "text.disabled", wordBreak: "break-word" }}>
          {value || "—"}
        </Typography>
        {value && value !== "—" && (
          <Tooltip title={`Copy ${fieldName}`}>
            <IconButton size="small" onClick={() => handleCopy(String(value), fieldName)} sx={{ color: "primary.main", bgcolor: "primary.50", width: 24, height: 24 }}>
              <ContentCopyIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <React.Fragment>
      {/* MAIN VISIBLE ROW - All columns visible to force horizontal scroll */}
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          bgcolor: open ? "rgba(22, 163, 74, 0.02)" : "inherit",
          transition: "background-color 0.3s",
          "&:hover": { bgcolor: "rgba(22, 163, 74, 0.04)" },
        }}
      >
        <TableCell padding="checkbox">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} sx={{ color: open ? "success.main" : "text.secondary" }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        
        <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>#{cust.id}</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "text.primary", whiteSpace: "nowrap" }}>{cust.name || "—"}</TableCell>
        <TableCell sx={{ fontFamily: "monospace", fontWeight: 500, color: "text.secondary", whiteSpace: "nowrap" }}>{cust.uanNumber || "—"}</TableCell>
        
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Chip icon={<CheckCircleOutlineIcon style={{ fontSize: 14, color: "#16a34a" }} />} label="Completed" size="small" sx={{ backgroundColor: "rgba(22, 163, 74, 0.1)", color: "#15803d", fontWeight: 600, borderRadius: 1.5, px: 0.5 }} />
        </TableCell>
        
        <TableCell sx={{ fontWeight: 700, color: "success.main", whiteSpace: "nowrap" }}>
          {cust.paidAmount != null ? `₹${cust.paidAmount.toLocaleString()}` : "—"}
        </TableCell>

        <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
          {formatDate(cust.confirmDate)}
        </TableCell>

        <TableCell align="right" sx={{ pr: 2, whiteSpace: "nowrap" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, alignItems: "center" }}>
            
            <Tooltip title="Reopen to pending" arrow>
              <Button
                variant="outlined" size="small" color="warning" startIcon={<RestoreIcon fontSize="small" />}
                onClick={() => handleReopen(cust.id)}
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "warning.main", color: "warning.dark", py: 0.5, px: 1.5, "&:hover": { bgcolor: "rgba(245, 158, 11, 0.04)" } }}
              >
                Reopen
              </Button>
            </Tooltip>

            <Tooltip title="Delete record" arrow>
              <IconButton
                color="error" size="small" onClick={() => handleDelete(cust.id)}
                sx={{ border: "1px solid", borderColor: "error.light", borderRadius: 2, p: 0.8, "&:hover": { bgcolor: "rgba(239, 68, 68, 0.04)" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {/* EXPANDED DETAILS PANEL (Using CSS Grid instead of MUI Grid to fix TS Error) */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: { xs: 1, sm: 2 }, p: { xs: 2, sm: 3 }, bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}>
              <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontWeight: 700, color: "success.main", mb: 2 }}>
                Full Customer Details
              </Typography>
              
              {/* CSS Grid Setup - Error Free */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 3 }}>
                
                <Box>
                  <DetailItem label="UAN Number" value={cust.uanNumber} fieldName="UAN Number" />
                  <DetailItem label="UAN Password" value={cust.uanPassword} fieldName="UAN Password" />
                  <DetailItem label="Mobile Number" value={cust.aadharMobile} fieldName="Mobile" />
                </Box>

                <Box>
                  <DetailItem label="Aadhar Card Name" value={cust.aadharCardName} fieldName="Aadhar Name" />
                  <DetailItem label="Aadhar Number" value={cust.aadharNumber} fieldName="Aadhar Number" />
                  <DetailItem label="DOB" value={formatDate(cust.dob)} fieldName="Date of Birth" />
                </Box>

                <Box>
                  <DetailItem label="Bank Account No" value={cust.bankAccountNumber} fieldName="Bank Account" />
                  <DetailItem label="IFSC Code" value={cust.ifscCode} fieldName="IFSC Code" />
                  <DetailItem label="Paid Amount" value={cust.paidAmount != null ? `₹${cust.paidAmount}` : null} fieldName="Paid Amount" />
                </Box>

                <Box>
                  <DetailItem label="Commission Amount" value={cust.commissionAmount != null ? `₹${cust.commissionAmount}` : null} fieldName="Commission" />
                  <DetailItem label="Completed Date" value={formatDate(cust.confirmDate)} fieldName="Completed Date" />
                  
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small" variant="outlined" startIcon={<VisibilityIcon fontSize="small" />}
                      onClick={() => handleViewUpdatedStatus(cust.updatedStatus || "")} disabled={!cust.updatedStatus}
                      sx={{ textTransform: "none", borderRadius: 2, width: "100%", borderColor: "divider", color: "text.primary" }}
                    >
                      {cust.updatedStatus ? "View Notes" : "No Notes"}
                    </Button>
                  </Box>
                </Box>

              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

// =========================================================
// MAIN COMPONENT
// =========================================================
const CompletedCustomer: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [filteredData, setFilteredData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewText, setViewText] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/epf/all`);
      const result = await res.json();
      setData(result);
      setFilteredData(result.filter((cust: Customer) => cust.workStatus === "Completed"));
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
    const filtered = data
      .filter((cust) => cust.workStatus === "Completed")
      .filter(
        (cust) =>
          cust.name?.toLowerCase().includes(lower) ||
          cust.aadharCardName?.toLowerCase().includes(lower) ||
          cust.uanNumber?.toLowerCase().includes(lower)
      );

    setFilteredData(filtered);
  }, [search, data]);

  const handleCopy = (text: string | null | undefined, label: string) => {
    if (!text || text === "—") return;
    navigator.clipboard.writeText(text);
    setCopyMessage(`${label} copied!`);
    setSnackbarOpen(true);
  };

  const handleViewUpdatedStatus = (text: string) => {
    setViewText(text || "No details available");
    setOpenViewDialog(true);
  };

  const handleDelete = async (id: number) => {
    const { value: password } = await Swal.fire({
      title: "Admin Authorization",
      input: "password",
      inputLabel: "Security password required to delete record",
      inputPlaceholder: "Enter password",
      showCancelButton: true,
      confirmButtonText: "Delete Record",
      confirmButtonColor: "#ef4444",
      customClass: { popup: "rounded-2xl" },
    });

    if (!password) return;

    try {
      const res = await fetch(`${API_URL}/api/epf/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const responseData = await res.json();

      if (res.ok) {
        Swal.fire({ icon: "success", title: "Deleted!", text: responseData.message, timer: 1500, showConfirmButton: false });
        fetchData();
      } else {
        Swal.fire("Error", responseData.message || "Invalid password", "error");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      Swal.fire("Error", "Server connection failed", "error");
    }
  };

  const handleReopen = async (id: number) => {
    const { value: password } = await Swal.fire({
      title: "Reopen Record",
      input: "password",
      inputLabel: "Enter admin password to move back to pending",
      inputPlaceholder: "Enter password",
      showCancelButton: true,
      confirmButtonText: "Move to Pending",
      confirmButtonColor: "#f59e0b",
      customClass: { popup: "rounded-2xl" },
    });

    if (!password) return;

    try {
      const res = await fetch(`${API_URL}/api/epf/reopen/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const responseData = await res.json();

      if (res.ok) {
        Swal.fire({ icon: "success", title: "Reopened", text: "Customer moved back to pending list successfully", timer: 1500, showConfirmButton: false });
        fetchData();
      } else {
        Swal.fire("Error", responseData.message || "Failed to reopen", "error");
      }
    } catch (error) {
      console.error("Reopen Error:", error);
      Swal.fire("Error", "Server connection failed", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "60vh", gap: 2.5 }}>
        <CircularProgress thickness={4} size={48} sx={{ color: "#16a34a" }} />
        <Typography sx={{ color: "text.secondary", fontWeight: 500, letterSpacing: 0.5 }}>
          Loading completed records...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: { xs: 1, sm: 3, md: 4 }, maxWidth: 1400, mx: "auto" }}>
        
        {/* TOP HEADER */}
        <Box
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, mb: { xs: 2, sm: 4 },
            flexDirection: { xs: "column", sm: "row" }, gap: 2, bgcolor: "background.paper", p: { xs: 2, sm: 3 },
            borderRadius: { xs: 3, sm: 4 }, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)"
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
              Completed Customers
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
              Archive of successfully processed files. Swipe horizontally to view table columns.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", sm: "auto" } }}>
            <TextField
              variant="outlined" size="small" placeholder="Search Name, UAN, Aadhar..." value={search} onChange={(e) => setSearch(e.target.value)}
              sx={{ width: "100%", minWidth: { sm: 260 }, "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "grey.50" } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: "text.secondary" }} /></InputAdornment> }}
            />
            <Button
              variant="contained" disableElevation onClick={() => setOpenDialog(true)}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 3, px: 2.5, py: 1, bgcolor: "#16a34a", width: { xs: "100%", sm: "auto" }, "&:hover": { bgcolor: "#15803d" } }}
            >
              + Add Customer
            </Button>
          </Box>
        </Box>

        {/* DATA TABLE - OVERFLOW 'AUTO' FIXES THE HORIZONTAL SCROLLING */}
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ 
            borderRadius: { xs: 3, sm: 4 }, 
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.03)", 
            border: "1px solid", 
            borderColor: "grey.100", 
            overflowX: "auto" // ⬅️ SCROLL YAHAN SE THEEK HUA HAI
          }}
        >
          {/* minWidth 1000px forces the table to scroll on phones */}
          <Table sx={{ minWidth: 1000 }}> 
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell width="40px" sx={{ px: { xs: 1, sm: 2 } }} />
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2.5, whiteSpace: "nowrap" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>UAN Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>Paid Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>Completed On</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", pr: { xs: 1, sm: 4 }, whiteSpace: "nowrap" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((cust) => (
                  <CustomerRow
                    key={cust.id}
                    cust={cust}
                    handleCopy={handleCopy}
                    handleDelete={handleDelete}
                    handleReopen={handleReopen}
                    handleViewUpdatedStatus={handleViewUpdatedStatus}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      No completed records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <AddCustomerDialog open={openDialog} onClose={() => setOpenDialog(false)} onAdded={fetchData} />

        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3, p: 1, m: { xs: 2, sm: 4 } } }}>
          <DialogTitle sx={{ fontWeight: 700, pb: 1, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>📝 Work Notes & Status</DialogTitle>
          <DialogContent dividers sx={{ borderColor: "divider", p: { xs: 2, sm: 3 } }}>
            <Box sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace", bgcolor: "grey.50", p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", minHeight: "100px", fontSize: { xs: "0.8rem", sm: "0.9rem" }, color: "text.primary" }}>
              {viewText}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
            <Button onClick={() => setOpenViewDialog(false)} variant="contained" disableElevation sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3, bgcolor: "#16a34a", "&:hover": { bgcolor: "#15803d" } }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%", borderRadius: 2, fontWeight: 600, boxShadow: 4 }}>
            {copyMessage}
          </Alert>
        </Snackbar>

      </Box>
    </Fade>
  );
};

export default CompletedCustomer;