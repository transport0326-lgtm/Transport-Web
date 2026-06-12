import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/stores/store";
import { suspendRider } from "../../redux/sagas/riderManagement/suspendRiderAction";
import { resetSuspend } from "../../redux/slices/riderManagementSlice";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  OutlinedInput,
  Dialog,
} from "@mui/material";
import { getInitials } from "../../utils/avatar";
import { capitalizeVehicle } from "../../utils/vehicle";

const SUSPEND_REASONS = [
  { key: "terms_violation", emoji: "⚠️", label: "Violation of Terms & Conditions", sub: "Breach of platform rules or policies" },
  { key: "customer_complaints", emoji: "📋", label: "Multiple Customer Complaints", sub: "Repeated complaints received from customers" },
  { key: "safety_violations", emoji: "🚦", label: "Traffic / Safety Violations", sub: "Reckless driving or safety incidents reported" },
  { key: "fraud", emoji: "🔍", label: "Fraudulent Activity Suspected", sub: "Suspicious order or payment behaviour" },
  { key: "inactive", emoji: "📵", label: "Unresponsive / Inactive", sub: "Not responding or inactive for 30+ days" },
  { key: "other", emoji: "✏️", label: "Other (specify below)", sub: "Enter a custom reason in the notes field" },
];

const DURATIONS = [
  { key: "7days", label: "7 Days" },
  { key: "30days", label: "30 Days" },
  { key: "permanent", label: "Permanent" },
];

interface SuspendRiderModalProps {
  open: boolean;
  onClose: () => void;
  riderId: string;
  riderName: string;
  vehicleType: string | null | undefined;
  zone: string | null | undefined;
  trips: number;
  avgRating: number | null;
}

const SuspendRiderModal = ({
  open, onClose, riderId, riderName, vehicleType, zone, trips, avgRating,
}: SuspendRiderModalProps) => {
  const dispatch = useDispatch();
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("7days");
  const [notes, setNotes] = useState("");
  const { suspendLoading, suspendError, suspendSuccess } = useSelector(
    (state: RootState) => state.riderManagement,
  );

  useEffect(() => {
    if (suspendSuccess) {
      dispatch(resetSuspend());
      setSelectedReason("");
      setSelectedDuration("7days");
      setNotes("");
      onClose();
    }
  }, [suspendSuccess]);

  const handleClose = () => {
    dispatch(resetSuspend());
    setSelectedReason("");
    setSelectedDuration("7days");
    setNotes("");
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedReason) return;
    const reasonLabel = selectedReason === "other"
      ? "Other"
      : (SUSPEND_REASONS.find((r) => r.key === selectedReason)?.label ?? selectedReason);
    dispatch(suspendRider({ riderId, reason: reasonLabel, duration: selectedDuration, notes }));
  };

  const initials = getInitials(riderName);
  const isOther = selectedReason === "other";
  const canSubmit = selectedReason && (!isOther || notes.trim());

  const stripMeta = [
    capitalizeVehicle(vehicleType),
    zone,
    `${trips} trips`,
    avgRating !== null ? `★ ${avgRating.toFixed(1)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      sx={{ "& .MuiDialog-paper": { width: 540, borderRadius: 2.5, overflow: "hidden", m: 2 } }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#f2991a", px: 3, height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Typography sx={{ fontSize: "1.1rem", lineHeight: 1 }}>⚠️</Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#fff" }}>
            Suspend Partner Account
          </Typography>
        </Box>
        <Button
          size="small" onClick={handleClose}
          sx={{
            color: "#fff", border: "1px solid rgba(255,255,255,0.55)", borderRadius: 3,
            textTransform: "none", fontSize: "0.78rem", px: 1.5, py: 0.4, minWidth: 0,
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
        >
          ✕&nbsp; Cancel
        </Button>
      </Box>

      {/* Rider strip */}
      <Box
        sx={{
          bgcolor: "#fff7eb", borderTop: "1px solid #e5c780", borderBottom: "1px solid #e5c780",
          px: 3, height: 56, display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0,
        }}
      >
        <Avatar sx={{ width: 34, height: 34, bgcolor: "#001a48", fontSize: "0.68rem", fontWeight: 700 }}>
          {initials}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1a1f", lineHeight: 1.3 }}>
            {riderName}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#73737a", lineHeight: 1.3 }}>
            {stripMeta}
          </Typography>
        </Box>
        <Chip
          label={`TRP-R-${riderId.slice(-4).toUpperCase()}`}
          size="small"
          sx={{ fontSize: "0.68rem", fontWeight: 500, height: 22, bgcolor: "#f5f5f7", color: "#73737a", "& .MuiChip-label": { px: 1 } }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, pt: 2.5, pb: 1, maxHeight: "60vh", overflowY: "auto" }}>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1a1f", mb: 1.5 }}>
          Select Suspension Reason *
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {SUSPEND_REASONS.map((reason) => {
            const isSelected = selectedReason === reason.key;
            return (
              <Box
                key={reason.key}
                onClick={() => setSelectedReason(reason.key)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  height: 56, px: 1.75, borderRadius: 2, cursor: "pointer",
                  bgcolor: isSelected ? "#fff7e0" : "#f5f5f7",
                  border: `1.5px solid ${isSelected ? "#f2991a" : "transparent"}`,
                  "&:hover": { filter: isSelected ? "none" : "brightness(0.97)" },
                }}
              >
                <Box
                  sx={{
                    width: 34, height: 34, borderRadius: 1.5,
                    bgcolor: isSelected ? "#ffe5b2" : "#e5e5ed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.9rem", flexShrink: 0,
                  }}
                >
                  {reason.emoji}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "0.76rem",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "#995900" : "#1a1a1f",
                      lineHeight: 1.3,
                    }}
                  >
                    {reason.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: "#73737a", lineHeight: 1.3 }}>
                    {reason.sub}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: `1.5px solid ${isSelected ? "#f2991a" : "#e0e0e5"}`,
                    bgcolor: isSelected ? "#f2991a" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  {isSelected && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff" }} />}
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Duration pills */}
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1a1f", mt: 2, mb: 1 }}>
          Suspension Duration *
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          {DURATIONS.map((d) => {
            const isActive = selectedDuration === d.key;
            return (
              <Box
                key={d.key}
                onClick={() => setSelectedDuration(d.key)}
                sx={{
                  px: 2.5, height: 36, display: "flex", alignItems: "center",
                  borderRadius: 1.5, cursor: "pointer",
                  bgcolor: isActive ? "#001a48" : "#fff",
                  border: `1.5px solid ${isActive ? "#001a48" : "#e0e0e5"}`,
                  "&:hover": { filter: "brightness(0.96)" },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.82rem",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#fff" : "#73737a",
                  }}
                >
                  {d.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Typography sx={{ fontSize: "0.76rem", fontWeight: 500, color: "#73737a", mb: 1 }}>
          Additional Notes (Optional)
        </Typography>
        <OutlinedInput
          fullWidth multiline rows={3}
          placeholder="Describe the reason in detail..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{
            fontSize: "0.78rem", borderRadius: 1.5, bgcolor: "#f5f5f7",
            "& fieldset": { borderColor: "#e0e0e5" },
            "&:hover fieldset": { borderColor: "#d0d0d5" },
            "&.Mui-focused fieldset": { borderColor: "#f2991a" },
          }}
        />

        <Box
          sx={{
            display: "flex", gap: 1, alignItems: "flex-start",
            bgcolor: "#fff7eb", border: "1px solid #e5c780", borderRadius: 1.5,
            px: 1.5, py: 1.2, mt: 1.5, mb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: "0.78rem", lineHeight: 1, flexShrink: 0 }}>⚠️</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#995900", lineHeight: 1.5 }}>
            Rider loses app access immediately. They'll be notified by SMS &amp; email. This action is logged and can be reversed by unsuspending.
          </Typography>
        </Box>

        {suspendError && (
          <Typography sx={{ fontSize: "0.74rem", color: "#dc2626", mt: 1 }}>
            {suspendError}
          </Typography>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ display: "flex", gap: 1.5, px: 3, py: 2, borderTop: "1px solid #f3f4f6" }}>
        <Button
          fullWidth onClick={handleClose}
          sx={{
            textTransform: "none", fontWeight: 600, fontSize: "0.88rem",
            color: "#1a1a1f", border: "1.5px solid #e0e0e5", borderRadius: 2, py: 1.2,
            "&:hover": { bgcolor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth variant="contained" disableElevation
          disabled={suspendLoading || !canSubmit}
          onClick={handleSubmit}
          sx={{
            textTransform: "none", fontWeight: 600, fontSize: "0.88rem",
            bgcolor: "#f2991a", borderRadius: 2, py: 1.2,
            "&:hover": { bgcolor: "#d97f0e" },
            "&.Mui-disabled": { bgcolor: "#fde68a", color: "#fff" },
          }}
        >
          {suspendLoading ? "Suspending..." : "⚠️  Confirm Suspension"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default SuspendRiderModal;
