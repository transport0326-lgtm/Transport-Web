import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import AdminLayout from "../../components/layout/AdminLayout";
import DeleteConfirmModal from "../../components/modals/DeleteConfirmModal";
import { getInitials } from "../../utils/avatar";
import { formatDate } from "./RiderProfileHelpers";
import type {
  RiderDetailRider,
  RiderDetailStats,
} from "../../redux/slices/riderDetailSlice";

interface RiderProfileSuspendedViewProps {
  rider: RiderDetailRider;
  stats: RiderDetailStats;
  vehicleLabel: string;
  zoneLabel: string;
  unsuspendLoading: boolean;
  unsuspendError: string | null;
  onUnsuspend: () => void;
}

const RiderProfileSuspendedView: React.FC<RiderProfileSuspendedViewProps> = ({
  rider,
  stats,
  vehicleLabel,
  zoneLabel,
  unsuspendLoading,
  unsuspendError,
  onUnsuspend,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const suspension = (rider.suspension ?? {}) as {
    reason?: string;
    suspendedAt?: string;
    suspendedBy?: string;
    duration?: string;
    autoReinstate?: string;
    notes?: string;
  };
  const suspendedOnFmt = suspension.suspendedAt
    ? formatDate(suspension.suspendedAt)
    : "—";
  const durationLabel: string = suspension.duration ?? "—";
  const autoReinstate = suspension.autoReinstate
    ? suspension.duration?.toLowerCase().includes("permanent")
      ? "Permanent"
      : formatDate(suspension.autoReinstate)
    : "—";

  const initials = getInitials(rider.name);

  return (
    <AdminLayout
      pageTitle="Partner Profile"
      breadcrumbs={[
        { label: "Partner Management", path: "/riders" },
        { label: rider.name },
      ]}
    >
      {/* ── Suspension Banner ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#fff1f1",
          border: "1px solid #ebc7c7",
          borderRadius: 2,
          px: 2.5,
          py: 1.2,
          mb: 2.5,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{ fontSize: "0.95rem", lineHeight: 1, flexShrink: 0 }}
          >
            ⛔
          </Typography>
          <Typography
            sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#e53838" }}
          >
            This Partner account is currently SUSPENDED
            {suspension.reason && `  ·  Reason: ${suspension.reason}`}
            {suspension.suspendedAt && `  ·  Suspended on ${suspendedOnFmt}`}
            {suspension.duration && `  ·  Duration: ${durationLabel}`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          disabled={unsuspendLoading}
          onClick={onUnsuspend}
          sx={{
            bgcolor: "#21b057",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8rem",
            borderRadius: 2,
            px: 2,
            flexShrink: 0,
            "&:hover": { bgcolor: "#1a9447" },
            "&.Mui-disabled": { bgcolor: "#a7f3c5", color: "#fff" },
          }}
        >
          {unsuspendLoading ? "Unsuspending…" : "✓  Unsuspend Partner"}
        </Button>
      </Box>

      {/* ── 2-column layout ── */}
      <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start" }}>
        {/* LEFT */}
        <Box sx={{ width: 260, flexShrink: 0 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              p: 2.5,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Box
              sx={{
                width: 82,
                height: 82,
                borderRadius: "50%",
                border: "3px solid #e53838",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: "3px",
                flexShrink: 0,
              }}
            >
              <Avatar
                src={rider.profilePhotoUrl ?? undefined}
                sx={{
                  width: 76,
                  height: 76,
                  bgcolor: "#001a48",
                  fontSize: "1.4rem",
                  fontWeight: 800,
                }}
              >
                {initials}
              </Avatar>
            </Box>

            <Typography
              sx={{ fontSize: "1rem", fontWeight: 700, color: "#1a1a1f" }}
            >
              {rider.name}
            </Typography>

            <Box
              sx={{
                bgcolor: "#fff1f1",
                border: "1px solid #e0b8b8",
                borderRadius: 10,
                px: 1.5,
                py: 0.3,
              }}
            >
              <Typography
                sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#e53838" }}
              >
                ⛔&nbsp; Suspended
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "#f5f5f7",
                borderRadius: 1.5,
                width: "100%",
                display: "flex",
                py: 1,
              }}
            >
              {[
                {
                  label: "Rating",
                  value:
                    stats.avgRating !== null
                      ? `${stats.avgRating.toFixed(1)}★`
                      : "—",
                },
                { label: "Trips", value: String(stats.trips) },
                { label: "Done", value: `${stats.completionRate}%` },
              ].map((s, i) => (
                <Box
                  key={s.label}
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    borderRight: i < 2 ? "1px solid #e0e0e5" : "none",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a1a1f" }}
                  >
                    {s.value}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#73737a" }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {[
            { emoji: "📱", label: "Phone", value: rider.phone },
            { emoji: "✉️", label: "Email", value: rider.email || "—" },
            { emoji: "🚗", label: "Vehicle", value: vehicleLabel },
            { emoji: "📍", label: "Zone", value: zoneLabel },
          ].map((row) => (
            <Box
              key={row.label}
              sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}
            >
              <Typography sx={{ fontSize: "0.9rem", lineHeight: 1, flexShrink: 0 }}>
                {row.emoji}
              </Typography>
              <Box>
                <Typography sx={{ fontSize: "0.62rem", color: "#73737a", lineHeight: 1 }}>
                  {row.label}
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 500, color: "#1a1a1f" }}>
                  {row.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* RIGHT */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Suspension Details */}
          <Box
            sx={{
              bgcolor: "#fff1f1",
              border: "1.5px solid #ebc7c7",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#e53838" }}>
                ⛔&nbsp; Suspension Details
              </Typography>
              <Button
                variant="contained"
                disableElevation
                disabled={unsuspendLoading}
                onClick={onUnsuspend}
                sx={{
                  bgcolor: "#21b057",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  borderRadius: 1.5,
                  px: 2,
                  boxShadow: "0 2px 8px rgba(33,176,87,0.3)",
                  "&:hover": { bgcolor: "#1a9447" },
                  "&.Mui-disabled": { bgcolor: "#a7f3c5", color: "#fff" },
                }}
              >
                {unsuspendLoading ? "Unsuspending…" : "✓  Unsuspend Partner"}
              </Button>
            </Box>

            <Divider sx={{ mb: 1.5, borderColor: "#ebc7c7" }} />

            <Box sx={{ display: "flex", gap: 1.5, mb: 1.2 }}>
              <Typography sx={{ fontSize: "0.78rem", color: "#73737a", width: 130, flexShrink: 0 }}>
                Reason
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#e53838" }}>
                {suspension.reason ?? "—"}
              </Typography>
            </Box>

            {[
              { label: "Suspended On", value: suspendedOnFmt },
              { label: "Suspended By", value: suspension.suspendedBy ?? "—" },
              {
                label: "Duration",
                value: suspension.duration
                  ? suspension.duration.toLowerCase().includes("permanent")
                    ? "Permanent"
                    : `Temporary — ${durationLabel}`
                  : "—",
              },
              { label: "Auto-Reinstate", value: autoReinstate },
              { label: "Notes", value: suspension.notes ?? "—" },
            ].map((row) => (
              <Box key={row.label} sx={{ display: "flex", gap: 1.5, mb: 1.2 }}>
                <Typography sx={{ fontSize: "0.78rem", color: "#73737a", width: 130, flexShrink: 0 }}>
                  {row.label}
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 500, color: "#1a1a1f" }}>
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Account Actions */}
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e0e0e5",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1a1a1f", mb: 1.5 }}>
              Account Actions
            </Typography>
            <Divider sx={{ mb: 1.5 }} />

            <Box
              onClick={onUnsuspend}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#ebfff0",
                border: "1.5px solid #21b057",
                borderRadius: 1.5,
                px: 2,
                height: 52,
                mb: 1,
                cursor: unsuspendLoading ? "not-allowed" : "pointer",
                opacity: unsuspendLoading ? 0.6 : 1,
                "&:hover": { filter: unsuspendLoading ? "none" : "brightness(0.97)" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#21b057" }}>
                  ✓&nbsp; Unsuspend Partner
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: "#73737a" }}>
                  Restore Partner access to the app
                </Typography>
              </Box>
              <Typography sx={{ color: "#21b057", fontWeight: 600, fontSize: "1rem" }}>›</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#f5f5f7",
                borderRadius: 1.5,
                px: 2,
                height: 48,
                mb: 1,
                cursor: "pointer",
                "&:hover": { filter: "brightness(0.97)" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#1a1a1f" }}>
                  🔑&nbsp; Password Reset
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: "#73737a" }}>Send via email</Typography>
              </Box>
              <Typography sx={{ color: "#73737a", fontSize: "1rem" }}>›</Typography>
            </Box>

            <Box
              onClick={() => setDeleteModalOpen(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#fff1f1",
                border: "1px solid #e5c2c2",
                borderRadius: 1.5,
                px: 2,
                height: 48,
                cursor: "pointer",
                "&:hover": { filter: "brightness(0.97)" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#e53838" }}>
                  🗑️&nbsp; Delete Account
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: "#73737a" }}>Irreversible action</Typography>
              </Box>
              <Typography sx={{ color: "#e53838", fontWeight: 600, fontSize: "1rem" }}>›</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {unsuspendError && (
        <Typography sx={{ fontSize: "0.78rem", color: "#e53838", mt: 1.5, textAlign: "center" }}>
          {unsuspendError}
        </Typography>
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        riderName={rider.name}
        riderId={rider._id}
      />
    </AdminLayout>
  );
};

export default RiderProfileSuspendedView;
