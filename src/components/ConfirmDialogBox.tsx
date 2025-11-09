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

  useEffect(() => {
    setForm(customer);
  }, [customer]);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validation by field name
    if (
      [
        "aadharNumber",
        "uanNumber",
        "bankAccountNumber",
        "aadharMobile",
      ].includes(name)
    ) {
      if (!/^\d*$/.test(value)) return; // only digits allowed
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
    try {
      const updatedData = {
        ...form,
        workStatus: "In Progress",
      };
      await fetch(`${API_URL}/api/epf/update/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      alert("✅ Updated (In Progress)");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/epf/confirm/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("✅ Confirmed Successfully");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Confirm error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Confirm Customer</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* UAN Number */}
          <Grid>
            <TextField
              fullWidth
              label="UAN Number (12 digits)"
              name="uanNumber"
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
              value={form.aadharCardName || ""}
              onChange={handleChange}
              inputProps={{ style: { textTransform: "uppercase" } }} // for visual uppercase
            />
          </Grid>

          {/* Mobile Number */}
          <Grid>
            <TextField
              fullWidth
              label="Aadhar Mobile (10 digits)"
              name="aadharMobile"
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
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.dob || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Work Status (disabled) */}
          <Grid>
            <TextField
              fullWidth
              label="Work Status"
              name="workStatus"
              value={form.workStatus}
              disabled
            />
          </Grid>

          {/* 🆕 Updated Status (Large Text Area) */}
          <Grid>
            <TextField
              fullWidth
              label="Updated Status (Work Details)"
              name="updatedStatus"
              value={form.updatedStatus || ""}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Write what work was done or needs to be done..."
            />
          </Grid>

          {/* IFSC Code */}
          <Grid>
            <TextField
              fullWidth
              label="IFSC Code"
              name="ifscCode"
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
              type="number"
              value={form.paidAmount ?? ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Password (hidden + non-copyable) */}
          <Grid>
            <TextField
              fullWidth
              label="Password"
              name="password"
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
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={loading}>
          Update
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          disabled={!form.paidAmount || Number(form.paidAmount) <= 0 || loading}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
