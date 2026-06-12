import React from "react";
import { Box, Typography, Avatar, Chip, Divider } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import InfoRow from "./RiderProfileInfoRow";
import { getInitials } from "../../utils/avatar";
import type {
  RiderDetailRider,
  RiderDetailStats,
} from "../../redux/slices/riderDetailSlice";

interface RiderProfileSidebarProps {
  rider: RiderDetailRider;
  stats: RiderDetailStats;
  vehicleLabel: string;
  zoneLabel: string;
  bankLabel: string;
}

const RiderProfileSidebar: React.FC<RiderProfileSidebarProps> = ({
  rider,
  stats,
  vehicleLabel,
  zoneLabel,
  bankLabel,
}) => {
  const initials = getInitials(rider.name);

  return (
    <Box
      sx={{
        width: 225,
        flexShrink: 0,
        height: "100%",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "#d1d5db", borderRadius: 4 },
        "&::-webkit-scrollbar-thumb:hover": { bgcolor: "#9ca3af" },
        pr: 0.5,
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            bgcolor: "#0D1B3E",
            px: 2,
            py: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.6,
          }}
        >
          <Avatar
            src={rider.profilePhotoUrl ?? undefined}
            sx={{
              width: 68,
              height: 68,
              bgcolor: "#E8490F",
              fontSize: "1.4rem",
              fontWeight: 800,
              border: "3px solid rgba(255,255,255,0.15)",
              mb: 0.5,
            }}
          >
            {initials}
          </Avatar>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#fff", textAlign: "center" }}>
            {rider.name}
          </Typography>
          <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>
            ID: {rider._id.slice(-8).toUpperCase()}
          </Typography>
          <Chip
            label={rider.isOnline ? "Online" : "Offline"}
            size="small"
            sx={{
              fontSize: "0.68rem",
              fontWeight: 700,
              height: 20,
              mt: 0.2,
              bgcolor: rider.isOnline ? "#dcfce7" : "#f3f4f6",
              color: rider.isOnline ? "#15803d" : "#6b7280",
              border: `1px solid ${rider.isOnline ? "#bbf7d0" : "#e5e7eb"}`,
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </Box>

        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <InfoRow icon={<PhoneIcon sx={{ fontSize: 16 }} />} label="Phone" value={rider.phone} />
          <InfoRow icon={<EmailIcon sx={{ fontSize: 16 }} />} label="Email" value={rider.email || "—"} />
          <InfoRow icon={<TwoWheelerIcon sx={{ fontSize: 16 }} />} label="Vehicle" value={vehicleLabel} />
          <InfoRow icon={<LocationOnIcon sx={{ fontSize: 16 }} />} label="Zone" value={zoneLabel} />
          <InfoRow icon={<BadgeIcon sx={{ fontSize: 16 }} />} label="DL No." value={rider.dlNumber || "—"} />
          <InfoRow icon={<AccountBalanceIcon sx={{ fontSize: 16 }} />} label="Bank" value={bankLabel} />
        </Box>

        <Divider />

        <Box sx={{ display: "flex", py: 1.8 }}>
          {[
            {
              label: "Rating",
              value: stats.avgRating !== null ? stats.avgRating.toFixed(1) : "—",
              extra:
                stats.avgRating !== null ? (
                  <StarIcon sx={{ fontSize: 13, color: "#f59e0b", mb: "-2px", ml: 0.3 }} />
                ) : null,
              color: "#111827",
            },
            { label: "Trips", value: String(stats.trips), extra: null, color: "#111827" },
            { label: "Done", value: `${stats.completionRate}%`, extra: null, color: "#16a34a" },
          ].map((stat, i) => (
            <Box
              key={stat.label}
              sx={{
                flex: 1,
                textAlign: "center",
                borderRight: i < 2 ? "1px solid #f3f4f6" : "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.2 }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </Typography>
                {stat.extra}
              </Box>
              <Typography sx={{ fontSize: "0.63rem", color: "#9ca3af" }}>{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default RiderProfileSidebar;
