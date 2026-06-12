import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/stores/store";
import {
  fetchPlatformConfig,
  updatePlatformConfig,
} from "../../redux/sagas/platformConfig/platformConfigAction";

// ── Styles ────────────────────────────────────────────────────────────────────

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.92rem",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#bbb" },
    "&.Mui-focused fieldset": { borderColor: "#0D1B3E" },
    "&.Mui-error fieldset": { borderColor: "#dc2626" },
  },
  "& .MuiFormHelperText-root": { fontSize: "0.7rem", mx: 0, mt: 0.4 },
};

// ── Validation ────────────────────────────────────────────────────────────────

const validatePct = (raw: string, label: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return `${label} is required`;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed))
    return "Enter a valid percentage (up to 2 decimals)";
  const n = Number(trimmed);
  if (isNaN(n)) return "Enter a valid number";
  if (n < 0) return "Cannot be negative";
  if (n > 100) return "Cannot exceed 100";
  return "";
};

// ── Component ─────────────────────────────────────────────────────────────────

const PlatformCommission: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, saving, error } = useSelector(
    (state: RootState) => state.platformConfig,
  );

  const [platformCommissionPct, setPlatformCommissionPct] = useState("");
  const [gstPct, setGstPct] = useState("");
  const [errors, setErrors] = useState<{ platformCommissionPct?: string; gstPct?: string }>({});
  const [touched, setTouched] = useState<{ platformCommissionPct?: boolean; gstPct?: boolean }>({});

  useEffect(() => {
    dispatch(fetchPlatformConfig());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setPlatformCommissionPct(
        data.platformCommissionPct != null ? String(data.platformCommissionPct) : "",
      );
      setGstPct(data.gstPct != null ? String(data.gstPct) : "");
    }
  }, [data]);

  const onChangePct =
    (
      key: "platformCommissionPct" | "gstPct",
      setter: (v: string) => void,
      label: string,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (v && !/^\d*\.?\d{0,2}$/.test(v)) return;
      setter(v);
      if (touched[key]) {
        setErrors((prev) => ({ ...prev, [key]: validatePct(v, label) }));
      }
    };

  const onBlurPct =
    (
      key: "platformCommissionPct" | "gstPct",
      getter: () => string,
      label: string,
    ) =>
    () => {
      setTouched((prev) => ({ ...prev, [key]: true }));
      setErrors((prev) => ({ ...prev, [key]: validatePct(getter(), label) }));
    };

  const handleSave = () => {
    const nextErrors = {
      platformCommissionPct: validatePct(platformCommissionPct, "Platform Commission"),
      gstPct: validatePct(gstPct, "GST"),
    };
    setTouched({ platformCommissionPct: true, gstPct: true });
    setErrors(nextErrors);
    if (nextErrors.platformCommissionPct || nextErrors.gstPct) return;
    dispatch(
      updatePlatformConfig({
        platformCommissionPct: Number(platformCommissionPct),
        gstPct: Number(gstPct),
      }),
    );
  };

  const handleCancel = () => {
    if (!data) return;
    setPlatformCommissionPct(
      data.platformCommissionPct != null ? String(data.platformCommissionPct) : "",
    );
    setGstPct(data.gstPct != null ? String(data.gstPct) : "");
    setErrors({});
    setTouched({});
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#0D1B3E" }} />
      </Box>
    );
  }

  // Preview computations (₹1000 sample ride)
  const sample = 1000;
  const commissionAmount = (sample * (Number(platformCommissionPct) || 0)) / 100;
  const gstAmount = (commissionAmount * (Number(gstPct) || 0)) / 100;
  const totalDeduction = commissionAmount + gstAmount;
  const riderPayout = sample - totalDeduction;

  return (
    <Box>
      {/* Page title */}
      <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1a1a2e", mb: 0.4 }}>
        Platform Commission
      </Typography>
      <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af", mb: 2.5 }}>
        Configure the commission rate the platform charges partners, and the GST
        applied on top of that commission.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: "0.82rem" }}>
          {error}
        </Alert>
      )}

      {/* ── Commission Settings ── */}
      <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", mb: 1.5 }}>
        Commission Settings
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2.5,
          mb: 3.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.3 }}>
            Platform Commission <span style={{ color: "#E8490F" }}>*</span>
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.8 }}>
            Percentage charged on each completed ride
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 20"
            value={platformCommissionPct}
            onChange={onChangePct(
              "platformCommissionPct",
              setPlatformCommissionPct,
              "Platform Commission",
            )}
            onBlur={onBlurPct(
              "platformCommissionPct",
              () => platformCommissionPct,
              "Platform Commission",
            )}
            error={Boolean(errors.platformCommissionPct)}
            helperText={errors.platformCommissionPct || " "}
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PercentIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.3 }}>
            GST on Commission <span style={{ color: "#E8490F" }}>*</span>
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.8 }}>
            Goods &amp; Services Tax applied on the commission amount
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 35"
            value={gstPct}
            onChange={onChangePct("gstPct", setGstPct, "GST")}
            onBlur={onBlurPct("gstPct", () => gstPct, "GST")}
            error={Boolean(errors.gstPct)}
            helperText={errors.gstPct || " "}
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <ReceiptLongIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* ── Sample Calculation ── */}
      <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", mb: 0.4 }}>
        Sample Calculation
      </Typography>
      <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", mb: 1.2 }}>
        On a ₹{sample.toLocaleString("en-IN")} fare:
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1.5,
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          p: 2,
          bgcolor: "#fff",
          mb: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}>Fare</Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
            ₹{sample}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}>
            Commission ({platformCommissionPct || 0}%)
          </Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#b45309" }}>
            ₹{commissionAmount.toFixed(2)}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}>
            GST ({gstPct || 0}%)
          </Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#b45309" }}>
            ₹{gstAmount.toFixed(2)}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}>
            Partner payout
          </Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#E8490F" }}>
            ₹{riderPayout.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: "#9ca3af" }}>
            after ₹{totalDeduction.toFixed(2)} deducted
          </Typography>
        </Box>
      </Box>

      {/* ── Actions ── */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 1 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={saving}
          sx={{
            textTransform: "none",
            borderColor: "#e5e7eb",
            color: "#374151",
            fontSize: "0.85rem",
            borderRadius: 2,
            px: 3,
            "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSave}
          disabled={saving || Boolean(errors.platformCommissionPct || errors.gstPct)}
          startIcon={
            saving ? (
              <CircularProgress size={14} sx={{ color: "#fff" }} />
            ) : (
              <SaveIcon sx={{ fontSize: "16px !important" }} />
            )
          }
          sx={{
            textTransform: "none",
            bgcolor: "#E8490F",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            "&:hover": { bgcolor: "#c93d0c" },
            "&.Mui-disabled": { bgcolor: "#f3b89a", color: "#fff" },
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default PlatformCommission;
