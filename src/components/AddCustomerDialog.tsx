import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (loading) return;
    setName("");
    setPassword("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/epf/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), password }),
      });

      if (response.ok) {
        onAdded();
        handleClose();
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.message || "Failed to add customer. Please try again.");
      }
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>
          Add New Customer
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, my: 1 }}>
            {error && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "error.lighter",
                  color: "error.dark",
                  borderRadius: 1,
                  fontSize: "0.875rem",
                  border: "1px solid",
                  borderColor: "error.light",
                }}
              >
                {error}
              </Box>
            )}
            <TextField
              label="Customer Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              fullWidth
              autoFocus
              disabled={loading}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ minWidth: 100 }}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCustomerDialog;