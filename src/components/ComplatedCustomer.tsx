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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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

const CompletedCustomer: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [filteredData, setFilteredData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/epf/all`);
      const result = await res.json();
      setData(result);
      setFilteredData(
        result.filter((cust: Customer) => cust.workStatus === "Completed")
      );
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

  const handleDelete = async (id: number) => {
    const { value: password } = await Swal.fire({
      title: "Admin Authorization",
      input: "password",
      inputLabel: "Security password required to delete record",
      inputPlaceholder: "Enter password",
      showCancelButton: true,
      confirmButtonText: "Delete Record",
      confirmButtonColor: "#ef4444",
      customClass: {
        popup: "rounded-2xl",
      },
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
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: responseData.message,
          timer: 1500,
          showConfirmButton: false,
        });
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
        Swal.fire({
          icon: "success",
          title: "Reopened",
          text: "Customer moved back to pending list successfully",
          timer: 1500,
          showConfirmButton: false,
        });
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
          Loading completed records...
        </Typography>
      </Box>
    );
  }

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
              Completed Customers
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Archive of all successfully processed EPF documentation files.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search Name, Aadhar, UAN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: 280,
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

            <Button
              variant="contained"
              disableElevation
              onClick={() => setOpenDialog(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 2.5,
                py: 1,
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              + Add Customer
            </Button>
          </Box>
        </Box>

        {/* Data Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.02)",
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 1200 }}>
            <TableHead sx={{ backgroundColor: "grey.50" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", py: 2 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Aadhar Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>UAN Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>DOB</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Paid Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Created Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Completed Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", pr: 4 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((cust) => (
                  <TableRow
                    key={cust.id}
                    sx={{
                      transition: "background-color 0.2s",
                      "&:hover": { backgroundColor: "rgba(37, 99, 235, 0.015)" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500, color: "text.secondary" }}>#{cust.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>{cust.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{cust.aadharCardName || "—"}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                      {cust.uanNumber || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{cust.dob || "—"}</TableCell>

                    <TableCell>
                      <Chip
                        icon={<CheckCircleOutlineIcon style={{ fontSize: 14, color: "#16a34a" }} />}
                        label={cust.workStatus}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(22, 163, 74, 0.08)",
                          color: "#15803d",
                          fontWeight: 600,
                          borderRadius: 1.5,
                          px: 0.5,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600, color: "success.main" }}>
                      {cust.paidAmount != null ? `₹${cust.paidAmount.toLocaleString()}` : "—"}
                    </TableCell>

                    <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                      {cust.createDate ? new Date(cust.createDate).toLocaleDateString() : "—"}
                    </TableCell>

                    <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                      {cust.confirmDate ? new Date(cust.confirmDate).toLocaleDateString() : "—"}
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, alignItems: "center" }}>
                        <Tooltip title="Reopen file to pending workflow" arrow>
                          <Button
                            variant="outlined"
                            size="small"
                            color="warning"
                            startIcon={<RestoreIcon fontSize="small" />}
                            onClick={() => handleReopen(cust.id)}
                            sx={{
                              textTransform: "none",
                              fontWeight: 500,
                              borderRadius: 2,
                              borderColor: "warning.main",
                              color: "warning.dark",
                              "&:hover": { bgcolor: "rgba(245, 158, 11, 0.04)" },
                            }}
                          >
                            Reopen
                          </Button>
                        </Tooltip>

                        <Tooltip title="Permanently delete record" arrow>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(cust.id)}
                            sx={{
                              border: "1px solid",
                              borderColor: "error.light",
                              borderRadius: 2,
                              p: 1,
                              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.04)" },
                            }}
                          >
                            DeleteIcon
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      No completed records found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <AddCustomerDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onAdded={fetchData}
        />
      </Box>
    </Fade>
  );
};

export default CompletedCustomer;