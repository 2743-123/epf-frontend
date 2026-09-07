import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Customer {
  id: number;
  aadharCardName: string;
  uanNumber: string;
  aadharNumber: string;
  dob: string;
  aadharMobile: string;
  uanPassword: string;
  workStatus: string;
  updatedStatus: string;
  bankAccountNumber: string;
  ifscCode: string;
  commissionAmount: number;
  password: string;
  paidAmount: number | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  customer: Customer;
  onUpdated: () => void;
}

const ConfirmDialog: React.FC<Props> = ({
  open,
  onClose,
  customer,
  onUpdated,
}) => {
  const [form, setForm] = useState<Customer>(customer);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setForm(customer);
    setError(null);
    setSuccessMsg(null);
  }, [customer, open]);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      [
        "aadharNumber",
        "uanNumber",
        "bankAccountNumber",
        "aadharMobile",
      ].includes(name)
    ) {
      if (!/^\d*$/.test(value)) return;
    }

    if (name === "aadharNumber" && value.length > 12) return;
    if (name === "uanNumber" && value.length > 12) return;
    if (name === "aadharMobile" && value.length > 10) return;

    if (name === "aadharCardName" || name === "ifscCode") {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = {
        ...form,
        workStatus: "In Progress",
      };
      const res = await fetch(`${API_URL}/api/epf/update/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setSuccessMsg("Updated successfully (In Progress)");
      setTimeout(() => {
        onUpdated();
        onClose();
      }, 800);
    } catch (err) {
      console.error("Update error:", err);
      setError("Server error while updating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!form.paidAmount || Number(form.paidAmount) <= 0) {
      setError("Paid amount is required to confirm.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/epf/confirm/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to confirm customer");

      setSuccessMsg("Confirmed successfully ✅");
      setTimeout(() => {
        onUpdated();
        onClose();
      }, 800);
    } catch (err) {
      console.error("Confirm error:", err);
      setError("Server error while confirming. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
        Review & Update Customer Details
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5 }}>
            {error}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2.5 }}>
            {successMsg}
          </Alert>
        )}

        <Grid container spacing={2.5}>
          {/* UAN Number */}
          <Grid>
            <TextField
              fullWidth
              label="UAN Number (12 digits)"
              name="uanNumber"
              size="small"
              value={form.uanNumber || ""}
              onChange={handleChange}
              inputProps={{ maxLength: 12, inputMode: "numeric" }}
            />
          </Grid>

          {/* UAN Password */}
          <Grid>
            <TextField
              fullWidth
              label="UAN Password"
              name="uanPassword"
              size="small"
              value={form.uanPassword || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Aadhar Number */}
          <Grid>
            <TextField
              fullWidth
              label="Aadhar Number (12 digits)"
              name="aadharNumber"
              size="small"
              value={form.aadharNumber || ""}
              onChange={handleChange}
              inputProps={{ maxLength: 12, inputMode: "numeric" }}
            />
          </Grid>

          {/* Aadhar Card Name */}
          <Grid>
            <TextField
              fullWidth
              label="Aadhar Card Name"
              name="aadharCardName"
              size="small"
              value={form.aadharCardName || ""}
              onChange={handleChange}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Grid>

          {/* Mobile Number */}
          <Grid>
            <TextField
              fullWidth
              label="Aadhar Mobile (10 digits)"
              name="aadharMobile"
              size="small"
              value={form.aadharMobile || ""}
              onChange={handleChange}
              inputProps={{ maxLength: 10, inputMode: "numeric" }}
            />
          </Grid>

          {/* Date of Birth */}
          <Grid>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.dob || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Work Status */}
          <Grid>
            <TextField
              fullWidth
              label="Work Status"
              name="workStatus"
              size="small"
              value={form.workStatus}
              disabled
            />
          </Grid>

          {/* IFSC Code */}
          <Grid >
            <TextField
              fullWidth
              label="IFSC Code"
              name="ifscCode"
              size="small"
              value={form.ifscCode || ""}
              onChange={handleChange}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Grid>

          {/* Bank Account Number */}
          <Grid>
            <TextField
              fullWidth
              label="Bank Account Number"
              name="bankAccountNumber"
              size="small"
              value={form.bankAccountNumber || ""}
              onChange={handleChange}
              inputProps={{ inputMode: "numeric" }}
            />
          </Grid>

          {/* Commission Amount */}
          <Grid>
            <TextField
              fullWidth
              label="Commission Amount"
              name="commissionAmount"
              size="small"
              type="number"
              value={form.commissionAmount ?? ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Paid Amount */}
          <Grid>
            <TextField
              fullWidth
              label="Paid Amount"
              name="paidAmount"
              size="small"
              type="number"
              required
              value={form.paidAmount ?? ""}
              onChange={handleChange}
              error={!form.paidAmount || Number(form.paidAmount) <= 0}
              helperText={
                !form.paidAmount || Number(form.paidAmount) <= 0
                  ? "Required for completion"
                  : ""
              }
            />
          </Grid>

          {/* Password (Secure view) */}
          <Grid>
            <TextField
              fullWidth
              label="System Password"
              name="password"
              size="small"
              type={showPassword ? "text" : "password"}
              value={form.password || ""}
              onChange={handleChange}
              inputProps={{
                readOnly: true,
                onCopy: (e) => e.preventDefault(),
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Updated Status (Large Text Area) */}
          <Grid>
            <TextField
              fullWidth
              label="Updated Status (Work Details)"
              name="updatedStatus"
              value={form.updatedStatus || ""}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Write what work was done or needs to be done..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          variant="outlined"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{ textTransform: "none" }}
        >
          Save Progress
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          disabled={!form.paidAmount || Number(form.paidAmount) <= 0 || loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Confirm & Complete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;