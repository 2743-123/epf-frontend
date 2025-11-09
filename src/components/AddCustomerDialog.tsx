import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  open,
  onClose,
  onAdded,
}) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!name || !password) {
      alert("Please fill both fields");
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      console.log("API_URL =", process.env.REACT_APP_API_URL);
      const response = await fetch(`${API_URL}/api/epf/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        alert("Customer added successfully ✅");
        onAdded();
        onClose();
        setName("");
        setPassword("");
      } else {
        alert("Failed to add customer ❌");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Customer</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Customer Name"
            variant="outlined"
            value={name.toUpperCase()}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            fullWidth
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerDialog;
