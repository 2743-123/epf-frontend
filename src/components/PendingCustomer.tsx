import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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

  // View Updated Status
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewText, setViewText] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  /** ✅ Fetch data from backend and filter only Pending or Updated or Reopened */
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/epf/all`);
      const result = await res.json();

      const pending = result.filter((r: Customer) => {
        const ws = r.workStatus?.toLowerCase() || "";
        return ws === "pending" || ws === "updated";
      });

      setData(pending);
      setFilteredData(pending);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]); // ✅ correct dependency

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /** ✅ Live Search */
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

  /** ✅ Open Confirm Dialog */
  const handleOpenConfirm = (cust: Customer) => {
    setSelectedCustomer({ ...cust });
    setOpenDialog(true);
  };

  /** ✅ Close Confirm Dialog */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
  };

  /** ✅ View Updated Status */
  const handleViewUpdatedStatus = (text: string) => {
    setViewText(text || "No details available");
    setOpenViewDialog(true);
  };

  const rotateStyle = {
    transform: "rotate(-45deg)",
    transformOrigin: "left bottom",
    display: "inline-block",
    whiteSpace: "nowrap",
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header + Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Pending EPF Customers
        </Typography>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Name, UAN, or Aadhar Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
          <Typography>Loading data...</Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: 3, overflowX: "auto" }}
        >
          <Table sx={{ minWidth: 1600 }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>UAN Number</TableCell>
                <TableCell>UAN Password</TableCell>
                <TableCell>Aadhar Number</TableCell>
                <TableCell>Aadhar Card Name</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Aadhar Mobile</TableCell>
                <TableCell>Bank A/C No.</TableCell>
                <TableCell>IFSC Code</TableCell>
                <TableCell>Commission</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Work Status</TableCell>
                <TableCell>Updated Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((cust) => (
                  <TableRow key={cust.id} hover>
                    <TableCell>{cust.id}</TableCell>
                    <TableCell>{cust.name || "-"}</TableCell>
                    <TableCell>{cust.uanNumber || "-"}</TableCell>
                    <TableCell>{cust.uanPassword || "-"}</TableCell>
                    <TableCell>{cust.aadharNumber || "-"}</TableCell>
                    <TableCell>{cust.aadharCardName || "-"}</TableCell>
                    <TableCell>{cust.dob || "-"}</TableCell>
                    <TableCell>{cust.aadharMobile || "-"}</TableCell>
                    <TableCell>{cust.bankAccountNumber || "-"}</TableCell>
                    <TableCell>{cust.ifscCode || "-"}</TableCell>
                    <TableCell>{cust.commissionAmount ?? "-"}</TableCell>
                    <TableCell>{cust.paidAmount ?? "-"}</TableCell>

                    <TableCell>
                      <Chip
                        label={cust.workStatus || "Pending"}
                        color={
                          cust.workStatus === "Updated"
                            ? "info"
                            : cust.workStatus === "In Progress"
                            ? "warning"
                            : "default"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {cust.updatedStatus ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleViewUpdatedStatus(cust.updatedStatus)
                          }
                        >
                          View
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleOpenConfirm(cust)}
                      >
                        Confirm
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={15} align="center">
                    No Pending Customers Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ✅ Confirm Dialog Box */}
      {selectedCustomer && (
        <ConfirmDialog
          open={openDialog}
          onClose={handleCloseDialog}
          customer={selectedCustomer}
          onUpdated={fetchData}
        />
      )}

      {/* ✅ View Updated Status Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>📝 Work Notes / Updated Status</DialogTitle>
        <DialogContent dividers>
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              background: "#f9f9f9",
              p: 2,
              borderRadius: 2,
              minHeight: "150px",
            }}
          >
            {viewText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingCustomer;
