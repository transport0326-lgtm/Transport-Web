import React from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BlockIcon from "@mui/icons-material/Block";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddIcon from "@mui/icons-material/Add";
import type {
  RiderDetailRider,
  RiderDetailZone,
} from "../../redux/slices/riderDetailSlice";

interface ZoneOption {
  _id: string;
  name: string;
  city: string;
}

interface RiderProfileZoneManagementProps {
  rider: RiderDetailRider;
  zone: RiderDetailZone | null;
  zoneLabel: string;
  zoneOptions: ZoneOption[];
  addZone: string;
  setAddZone: (id: string) => void;
  onAssignZone: () => void;
  onCreateZoneClick: () => void;
  onSuspendClick: () => void;
  onDeleteClick: () => void;
}

const RiderProfileZoneManagement: React.FC<RiderProfileZoneManagementProps> = ({
  rider,
  zone,
  zoneLabel,
  zoneOptions,
  addZone,
  setAddZone,
  onAssignZone,
  onCreateZoneClick,
  onSuspendClick,
  onDeleteClick,
}) => (
  <Box
    sx={{
      bgcolor: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 2,
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.6,
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <InfoOutlinedIcon sx={{ fontSize: 17, color: "#3b82f6" }} />
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>
        Delivery Zone Management
      </Typography>
    </Box>

    <Box sx={{ p: 2 }}>
      <Box sx={{ bgcolor: "#0D1B3E", borderRadius: 2, p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)" }}>
            Partner's Address
          </Typography>
          <Chip
            label="from Sign-Up"
            size="small"
            sx={{
              fontSize: "0.58rem",
              fontWeight: 600,
              height: 18,
              bgcolor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.65)",
              "& .MuiChip-label": { px: 0.8 },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.8 }}>
          <MyLocationIcon sx={{ fontSize: 18, color: "#E8490F", mt: 0.1, flexShrink: 0 }} />
          <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
            {rider.currentAddress ?? "Address not provided"}
          </Typography>
        </Box>
      </Box>

      {zone?.name ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>
              Assigned Zone
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              bgcolor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 1.5,
              px: 1.2,
              py: 0.7,
              mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 14, color: "#16a34a", flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.76rem", fontWeight: 500, color: "#15803d" }}>
              {zoneLabel}
            </Typography>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            bgcolor: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: "0.76rem", color: "#92400e", fontWeight: 500 }}>
            No zone assigned yet
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
        Add Partner to Another Zone
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 1 }}>
        <Select
          value={addZone}
          onChange={(e) => setAddZone(e.target.value)}
          displayEmpty
          sx={{
            fontSize: "0.8rem",
            borderRadius: 2,
            "& fieldset": { borderColor: "#e5e7eb" },
          }}
        >
          <MenuItem value="" disabled sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            Select zone to add partner...
          </MenuItem>
          {zoneOptions.map((z) => (
            <MenuItem key={z._id} value={z._id} sx={{ fontSize: "0.83rem" }}>
              {z.name} - {z.city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        fullWidth
        variant="contained"
        disableElevation
        disabled={!addZone}
        startIcon={<MyLocationIcon sx={{ fontSize: "15px !important" }} />}
        onClick={onAssignZone}
        sx={{
          bgcolor: "#0D1B3E",
          color: "#fff",
          textTransform: "none",
          fontSize: "0.8rem",
          fontWeight: 600,
          borderRadius: 2,
          py: 0.9,
          mb: 2.5,
          "&:hover": { bgcolor: "#162b5e" },
          "&.Mui-disabled": { bgcolor: "#e5e7eb", color: "#9ca3af" },
        }}
      >
        Add to Selected Zone
      </Button>

      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
        Create a New Zone
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon sx={{ fontSize: "15px !important" }} />}
        onClick={onCreateZoneClick}
        sx={{
          textTransform: "none",
          fontSize: "0.8rem",
          fontWeight: 600,
          borderColor: "#3b82f6",
          color: "#2563eb",
          borderRadius: 2,
          py: 0.9,
          mb: 2.5,
          "&:hover": { borderColor: "#2563eb", bgcolor: "#eff6ff" },
        }}
      >
        Create Zone &amp; Add Partner
      </Button>

      <Divider sx={{ mb: 1.5 }} />

      <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", mb: 1 }}>
        Account Actions
      </Typography>
      {[
        {
          icon: <BlockIcon sx={{ fontSize: 17 }} />,
          label: "Suspend Partner",
          sub: "Stop receiving orders",
          bg: "#fff7ed",
          border: "#fed7aa",
          color: "#ea580c",
          onClick: onSuspendClick,
        },
        {
          icon: <DeleteForeverIcon sx={{ fontSize: 17 }} />,
          label: "Delete Account",
          sub: "Irreversible action",
          bg: "#fef2f2",
          border: "#fecaca",
          color: "#dc2626",
          onClick: onDeleteClick,
        },
      ].map((action) => (
        <Box
          key={action.label}
          onClick={action.onClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            bgcolor: action.bg,
            border: `1px solid ${action.border}`,
            borderRadius: 2,
            px: 1.5,
            py: 1,
            mb: 0.8,
            cursor: "pointer",
            "&:hover": { filter: "brightness(0.97)" },
          }}
        >
          <Box sx={{ color: action.color, display: "flex", flexShrink: 0 }}>
            {action.icon}
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: action.color, lineHeight: 1.3 }}>
              {action.label}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: action.color, opacity: 0.65 }}>
              {action.sub}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export default RiderProfileZoneManagement;
