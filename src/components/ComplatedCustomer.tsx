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
  IconButton,
  TextField,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import AddCustomerDialog from "./AddCustomerDialog";

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
  // ✅ Fetch All Customers
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/epf/all`);
      const result = await res.json();
      setData(result);
      setFilteredData(
        result.filter((cust: Customer) => cust.workStatus === "Completed")
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Search Filter (NULL SAFE)
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

  // ✅ DELETE RECORD
  const handleDelete = async (id: number) => {
    const { value: password } = await Swal.fire({
      title: "Enter Admin Password",
      input: "password",
      inputLabel: "Password required to delete this record",
      inputPlaceholder: "Enter password",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!password) return;

    try {
      const res = await fetch(`${API_URL}/api/epf/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Deleted!", data.message, "success");
        fetchData();
      } else {
        Swal.fire("Error", data.message || "Invalid password", "error");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      Swal.fire("Error", "Server error occurred", "error");
    }
  };

  // ✅ REOPEN (Move to pending)
  const handleReopen = async (id: number) => {
    const { value: password } = await Swal.fire({
      title: "Enter Password",
      input: "password",
      inputPlaceholder: "Enter admin password",
      showCancelButton: true,
    });

    if (!password) return; // user cancelled

    try {
      const res = await fetch(`${API_URL}/api/epf/reopen/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }), // ✅ sending password
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire(
          "Reopened!",
          "Customer moved back to pending list",
          "success"
        );
        fetchData(); // reload list
      } else {
        Swal.fire("Error", data.message || "Failed to reopen", "error");
      }
    } catch (error) {
      console.error("Reopen Error:", error);
      Swal.fire("Error", "Server error occurred", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* ✅ Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Completed EPF Customers
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by Name, Aadhar or UAN"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
            }}
          />

          {/* ✅ Do NOT REMOVE THIS BUTTON */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            + Add Customer
          </Button>
        </Box>
      </Box>

      {/* ✅ TABLE */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Aadhar Name</TableCell>
              <TableCell>UAN</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Work Status</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Confirm Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((cust) => (
                <TableRow key={cust.id}>
                  <TableCell>{cust.id}</TableCell>
                  <TableCell>{cust.name}</TableCell>
                  <TableCell>{cust.aadharCardName}</TableCell>
                  <TableCell>{cust.uanNumber}</TableCell>
                  <TableCell>{cust.dob}</TableCell>

                  <TableCell>
                    <Chip
                      label={cust.workStatus}
                      sx={{
                        backgroundColor: "green",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>

                  <TableCell>{cust.paidAmount}</TableCell>

                  <TableCell>
                    {cust.createDate
                      ? new Date(cust.createDate).toLocaleString()
                      : "--"}
                  </TableCell>

                  <TableCell>
                    {cust.confirmDate
                      ? new Date(cust.confirmDate).toLocaleString()
                      : "--"}
                  </TableCell>

                  {/* ✅ ACTIONS */}
                  <TableCell sx={{ display: "flex", gap: 1 }}>
                    {/* ✅ REOPEN BUTTON */}
                    <Button
                      variant="contained"
                      size="small"
                      color="warning"
                      onClick={() => handleReopen(cust.id)}
                    >
                      Reopen
                    </Button>

                    {/* ✅ DELETE BUTTON */}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(cust.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No Completed Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Add Customer Dialog */}
      <AddCustomerDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onAdded={fetchData}
      />
    </Box>
  );
};

export default CompletedCustomer;
