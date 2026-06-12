import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/stores/store";
import { rejectRider } from "../../redux/sagas/riderManagement/rejectRiderAction";
import { resetReject } from "../../redux/slices/riderManagementSlice";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  OutlinedInput,
  Dialog,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getInitials } from "../../utils/avatar";
import { capitalizeVehicle } from "../../utils/vehicle";

const REJECTION_REASONS = [
  { key: "incomplete_documents", emoji: "📄", label: "Incomplete Documents", sub: "Missing DL, RC card, or profile photo" },
  { key: "invalid_documents", emoji: "🚫", label: "Invalid / Fake Documents", sub: "Documents appear forged or do not match" },
  { key: "vehicle_not_eligible", emoji: "🚗", label: "Vehicle Not Eligible", sub: "Vehicle type, age, or condition not approved" },
  { key: "failed_background", emoji: "🔍", label: "Failed Background Check", sub: "Criminal record or prior violations found" },
  { key: "duplicate_account", emoji: "👥", label: "Duplicate Account", sub: "Rider already registered with another account" },
  { key: "other", emoji: "✏️", label: "Other (specify below)", sub: "Enter a custom reason in the notes field" },
];

interface RejectRiderModalProps {
  open: boolean;
  onClose: () => void;
  riderId: string;
  riderName: string;
  vehicleType: string | null | undefined;
  zone: string | null | undefined;
  appliedDate: string;
}

const RejectRiderModal = ({
  open, onClose, riderId, riderName, vehicleType, zone, appliedDate,
}: RejectRiderModalProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");
  const { rejectLoading, rejectError, rejectSuccess } = useSelector(
    (state: RootState) => state.riderManagement,
  );

  useEffect(() => {
    if (rejectSuccess) {
      dispatch(resetReject());
      setSelectedReason("");
      setNotes("");
      onClose();
      navigate("/riders");
    }
  }, [rejectSuccess]);

  const handleClose = () => {
    dispatch(resetReject());
    setSelectedReason("");
    setNotes("");
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedReason) return;
    const reasonLabel = REJECTION_REASONS.find((r) => r.key === selectedReason)?.label ?? selectedReason;
    const rejectionReason = selectedReason === "other" && notes.trim() ? notes.trim() : reasonLabel;
    dispatch(rejectRider({ riderId, rejectionReason }));
  };

  const initials = getInitials(riderName);
  const isOther = selectedReason === "other";
  const canSubmit = selectedReason && (!isOther || notes.trim());

  const appliedLabel = appliedDate
    ? `Applied ${new Date(appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    : "";
  const stripMeta = [capitalizeVehicle(vehicleType), zone, appliedLabel].filter(Boolean).join(" · ");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      sx={{ "& .MuiDialog-paper": { width: 520, borderRadius: 2.5, overflow: "hidden", m: 2 } }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#001a48", px: 3, height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: 2, bgcolor: "#e54d4d",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: "#fff" }} />
          </Box>
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#fff" }}>
            Reject Partner Application
          </Typography>
        </Box>
        <IconButton
          size="small" onClick={handleClose}
          sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.15)", width: 32, height: 32, "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Rider strip */}
      <Box
        sx={{
          bgcolor: "#fff6f6", borderTop: "1px solid #f2cccc", borderBottom: "1px solid #f2cccc",
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
          label={`APP-${riderId.slice(-7).toUpperCase()}`}
          size="small"
          sx={{ fontSize: "0.68rem", fontWeight: 500, height: 22, bgcolor: "#f5f5f7", color: "#73737a", "& .MuiChip-label": { px: 1 } }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, pt: 2.5, pb: 1, maxHeight: "60vh", overflowY: "auto" }}>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1a1f", mb: 1.5 }}>
          Select Rejection Reason *
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          {REJECTION_REASONS.map((reason) => {
            const isSelected = selectedReason === reason.key;
            return (
              <Box
                key={reason.key}
                onClick={() => setSelectedReason(reason.key)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  height: 62, px: 1.75, borderRadius: 2, cursor: "pointer",
                  bgcolor: isSelected ? "#fff1f1" : "#f9f9fa",
                  border: `1.5px solid ${isSelected ? "#e53939" : "transparent"}`,
                  "&:hover": { filter: isSelected ? "none" : "brightness(0.97)" },
                }}
              >
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: 1.5,
                    bgcolor: isSelected ? "#ffe0e0" : "#ebebf0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", flexShrink: 0,
                  }}
                >
                  {reason.emoji}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "#e53939" : "#1a1a1f",
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
                    border: `1.5px solid ${isSelected ? "#e53939" : "#e0e0e5"}`,
                    bgcolor: isSelected ? "#e53939" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  {isSelected && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff" }} />}
                </Box>
              </Box>
            );
          })}
        </Box>

        <Typography sx={{ fontSize: "0.76rem", fontWeight: 500, color: "#73737a", mt: 2, mb: 1 }}>
          Additional Notes (Optional)
        </Typography>
        <OutlinedInput
          fullWidth multiline rows={3}
          placeholder="Add any additional notes for the rejection record..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{
            fontSize: "0.78rem", borderRadius: 1.5, bgcolor: "#f5f5f7",
            "& fieldset": { borderColor: "#e0e0e5" },
            "&:hover fieldset": { borderColor: "#d0d0d5" },
            "&.Mui-focused fieldset": { borderColor: "#e53939" },
          }}
        />

        <Box
          sx={{
            display: "flex", gap: 1, alignItems: "flex-start",
            bgcolor: "#fff6ed", border: "1px solid #f2d1b2", borderRadius: 1.5,
            px: 1.5, py: 1.2, mt: 1.5, mb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: "0.82rem", lineHeight: 1, flexShrink: 0 }}>⚠️</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#8c611a", lineHeight: 1.5 }}>
            The rider will be notified via SMS &amp; email with the rejection reason. This action can be reviewed by a Super Admin.
          </Typography>
        </Box>

        {rejectError && (
          <Typography sx={{ fontSize: "0.74rem", color: "#dc2626", mt: 1 }}>
            {rejectError}
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
          disabled={rejectLoading || !canSubmit}
          onClick={handleSubmit}
          startIcon={<CloseIcon sx={{ fontSize: "16px !important" }} />}
          sx={{
            textTransform: "none", fontWeight: 600, fontSize: "0.88rem",
            bgcolor: "#e53939", borderRadius: 2, py: 1.2,
            "&:hover": { bgcolor: "#c82020" },
            "&.Mui-disabled": { bgcolor: "#fecaca", color: "#fff" },
          }}
        >
          {rejectLoading ? "Rejecting..." : "Confirm Rejection"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default RejectRiderModal;
