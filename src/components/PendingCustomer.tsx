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
  Collapse,
  IconButton,
} from "@mui/material"; // Grid removed to avoid TS errors
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ConfirmDialog from "./ConfirmDialogBox";
import { Customer } from "./Types";

// =========================================================
// HELPER: Date Formatter
// =========================================================
const formatDOB = (dateString: string | undefined | null) => {
  if (!dateString) return "—";
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return dateString;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

// =========================================================
// SUB-COMPONENT: Expandable Row (Mobile Optimized & Scrollable)
// =========================================================
const CustomerRow = ({
  cust,
  handleCopy,
  handleOpenConfirm,
  handleViewUpdatedStatus,
}: {
  cust: Customer;
  handleCopy: (text: string | null | undefined, label: string) => void;
  handleOpenConfirm: (cust: Customer) => void;
  handleViewUpdatedStatus: (text: string) => void;
}) => {
  const [open, setOpen] = useState(false);

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
  }

  // Reusable Detail Item UI
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
      {/* MAIN VISIBLE ROW - Nowrap added to prevent text breaking while scrolling */}
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          bgcolor: open ? "rgba(37, 99, 235, 0.02)" : "inherit",
          transition: "background-color 0.3s",
          "&:hover": { bgcolor: "rgba(37, 99, 235, 0.04)" },
        }}
      >
        <TableCell padding="checkbox">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} sx={{ color: open ? "primary.main" : "text.secondary" }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>#{cust.id}</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "text.primary", whiteSpace: "nowrap" }}>{cust.name || "—"}</TableCell>
        <TableCell sx={{ fontFamily: "monospace", fontWeight: 500, color: "text.secondary", whiteSpace: "nowrap" }}>{cust.uanNumber || "—"}</TableCell>
        <TableCell sx={{ fontFamily: "monospace", fontWeight: 500, color: "text.secondary", whiteSpace: "nowrap" }}>{cust.aadharMobile || "—"}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Chip
            icon={<IconComponent style={{ fontSize: 14, color: chipColor }} />}
            label={cust.workStatus || "Pending"}
            size="small"
            sx={{ backgroundColor: chipBg, color: chipColor, fontWeight: 600, borderRadius: 1.5, px: 0.5 }}
          />
        </TableCell>
        <TableCell align="right" sx={{ pr: 2, whiteSpace: "nowrap" }}>
          <Button
            variant="contained" color="success" size="small" disableElevation
            startIcon={<CheckCircleIcon fontSize="small" />} onClick={() => handleOpenConfirm(cust)}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, bgcolor: "#16a34a", "&:hover": { bgcolor: "#15803d" } }}
          >
            Confirm
          </Button>
        </TableCell>
      </TableRow>

      {/* EXPANDED DETAILS PANEL - Using Error-Free CSS Grid */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: { xs: 1, sm: 2 }, p: { xs: 2, sm: 3 }, bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}>
              <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
                Detailed Information
              </Typography>
              
              {/* Responsive CSS Grid Implementation */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 3 }}>
                
                {/* Column 1: EPFO Login */}
                <Box>
                  <DetailItem label="UAN Password" value={cust.uanPassword} fieldName="UAN Password" />
                  <DetailItem label="DOB" value={formatDOB(cust.dob)} fieldName="Date of Birth" />
                </Box>

                {/* Column 2: Identity */}
                <Box>
                  <DetailItem label="Aadhar Card Name" value={cust.aadharCardName} fieldName="Aadhar Name" />
                  <DetailItem label="Aadhar Number" value={cust.aadharNumber} fieldName="Aadhar Number" />
                </Box>

                {/* Column 3: Banking */}
                <Box>
                  <DetailItem label="Bank Account No" value={cust.bankAccountNumber} fieldName="Bank Account" />
                  <DetailItem label="IFSC Code" value={cust.ifscCode} fieldName="IFSC Code" />
                </Box>

                {/* Column 4: Financials & Notes */}
                <Box>
                  <DetailItem label="Commission Amount" value={cust.commissionAmount != null ? `₹${cust.commissionAmount}` : null} fieldName="Commission" />
                  <DetailItem label="Paid Amount" value={cust.paidAmount != null ? `₹${cust.paidAmount}` : null} fieldName="Paid Amount" />
                  
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
const PendingCustomer: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [filteredData, setFilteredData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewText, setViewText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/epf/all`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const result = await res.json();
      const pending = result.filter((r: Customer) => {
        const ws = r.workStatus?.toLowerCase() || "";
        return ws === "pending" || ws === "updated" || ws === "in progress";
      });
      setData(pending);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 5 * 60 * 1000);
    return () => clearInterval(interval);
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

  const handleCopy = (text: string | null | undefined, label: string) => {
    if (!text || text === "—") return;
    navigator.clipboard.writeText(text);
    setCopyMessage(`${label} copied!`);
    setSnackbarOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "60vh", gap: 2.5 }}>
        <CircularProgress thickness={4} size={48} sx={{ color: "#3b82f6" }} />
        <Typography sx={{ color: "text.secondary", fontWeight: 500, letterSpacing: 0.5 }}>
          Loading pending queue...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: { xs: 1, sm: 3, md: 4 }, maxWidth: 1400, mx: "auto" }}>
        
        {/* HEADER SECTION */}
        <Box sx={{ 
          display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, mb: { xs: 2, sm: 4 }, 
          flexDirection: { xs: "column", sm: "row" }, gap: 2, bgcolor: "background.paper", p: { xs: 2, sm: 3 }, 
          borderRadius: { xs: 3, sm: 4 }, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)" 
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
              Pending Customers
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
              Expand rows to view full details. Swipe horizontally to view table columns.
            </Typography>
          </Box>
          <TextField
            variant="outlined" size="small" placeholder="Search Name, UAN, Aadhar..." value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "100%", minWidth: { sm: 260 }, "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "grey.50" } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: "text.secondary" }} /></InputAdornment> }}
          />
        </Box>

        {/* DATA TABLE - HORIZONTAL SCROLL ENABLED */}
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ 
            borderRadius: { xs: 3, sm: 4 }, 
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.03)", 
            border: "1px solid", 
            borderColor: "grey.100", 
            overflowX: "auto" // FIX FOR HORIZONTAL SCROLLING
          }}
        >
          {/* minWidth forces scroll on smaller screens */}
          <Table sx={{ minWidth: 1000 }}>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell width="40px" sx={{ px: { xs: 1, sm: 2 } }} />
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2.5, whiteSpace: "nowrap" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>UAN Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>Mobile Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", pr: { xs: 1, sm: 4 }, whiteSpace: "nowrap" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((cust) => (
                  <CustomerRow
                    key={cust.id}
                    cust={cust}
                    handleCopy={handleCopy}
                    handleOpenConfirm={handleOpenConfirm}
                    handleViewUpdatedStatus={(text) => { setViewText(text); setOpenViewDialog(true); }}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      No pending customers found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* DIALOGS & ALERTS */}
        {selectedCustomer && (
          <ConfirmDialog open={openDialog} onClose={() => { setOpenDialog(false); setSelectedCustomer(null); }} customer={selectedCustomer} onUpdated={() => fetchData(false)} />
        )}

        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3, p: 1, m: { xs: 2, sm: 4 } } }}>
          <DialogTitle sx={{ fontWeight: 700, pb: 1, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>📝 Work Notes & Status</DialogTitle>
          <DialogContent dividers sx={{ borderColor: "divider", p: { xs: 2, sm: 3 } }}>
            <Box sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace", bgcolor: "grey.50", p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", minHeight: "100px", fontSize: { xs: "0.8rem", sm: "0.9rem" }, color: "text.primary" }}>
              {viewText}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
            <Button onClick={() => setOpenViewDialog(false)} variant="contained" disableElevation sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3, bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}>Close</Button>
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

export default PendingCustomer;