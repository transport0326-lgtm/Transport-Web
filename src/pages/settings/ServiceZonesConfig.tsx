import React from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { configFieldSx } from "./ServiceZonesHelpers";

export interface ZoneConfigState {
  defaultRadiusKm: string;
  overlapAllowed: string;
  autoExpandOnHighDemand: string;
}

interface ServiceZonesConfigProps {
  zoneConfig: ZoneConfigState;
  setZoneConfig: React.Dispatch<React.SetStateAction<ZoneConfigState>>;
  onSave: () => void;
}

const ServiceZonesConfig: React.FC<ServiceZonesConfigProps> = ({
  zoneConfig,
  setZoneConfig,
  onSave,
}) => (
  <>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1.5,
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a1a2e" }}>
        Zone Configuration
      </Typography>
      <Button
        variant="contained"
        disableElevation
        size="small"
        onClick={onSave}
        sx={{
          bgcolor: "#E8490F",
          color: "#fff",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.78rem",
          borderRadius: 2,
          px: 2,
          py: 0.6,
          "&:hover": { bgcolor: "#c93d0c" },
        }}
      >
        Save Configuration
      </Button>
    </Box>

    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1.2,
          borderBottom: "1px solid #f5f5f5",
        }}
      >
        <Typography sx={{ fontSize: "0.85rem", color: "#444" }}>
          Default Zone Radius
        </Typography>
        <TextField
          value={zoneConfig.defaultRadiusKm}
          onChange={(e) =>
            setZoneConfig((prev) => ({
              ...prev,
              defaultRadiusKm: e.target.value,
            }))
          }
          size="small"
          placeholder="e.g., 5"
          sx={{ ...configFieldSx, width: 260 }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1.2,
          borderBottom: "1px solid #f5f5f5",
        }}
      >
        <Typography sx={{ fontSize: "0.85rem", color: "#444" }}>
          Overlap Allowed
        </Typography>
        <FormControl size="small" sx={{ width: 260 }}>
          <Select
            value={zoneConfig.overlapAllowed}
            onChange={(e) =>
              setZoneConfig((prev) => ({
                ...prev,
                overlapAllowed: e.target.value,
              }))
            }
            sx={{
              borderRadius: 1.5,
              fontSize: "0.85rem",
              bgcolor: "#f9f9f9",
              "& fieldset": { borderColor: "#e8e8e8" },
              "&:hover fieldset": { borderColor: "#bbb" },
              "&.Mui-focused fieldset": { borderColor: "#0D1B3E" },
            }}
          >
            <MenuItem value="Yes" sx={{ fontSize: "0.85rem" }}>Yes</MenuItem>
            <MenuItem value="No" sx={{ fontSize: "0.85rem" }}>No</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1.2,
        }}
      >
        <Typography sx={{ fontSize: "0.85rem", color: "#444" }}>
          Auto-expand on High Demand
        </Typography>
        <FormControl size="small" sx={{ width: 260 }}>
          <Select
            value={zoneConfig.autoExpandOnHighDemand}
            onChange={(e) =>
              setZoneConfig((prev) => ({
                ...prev,
                autoExpandOnHighDemand: e.target.value,
              }))
            }
            sx={{
              borderRadius: 1.5,
              fontSize: "0.85rem",
              bgcolor: "#f9f9f9",
              "& fieldset": { borderColor: "#e8e8e8" },
              "&:hover fieldset": { borderColor: "#bbb" },
              "&.Mui-focused fieldset": { borderColor: "#0D1B3E" },
            }}
          >
            <MenuItem value="Enabled" sx={{ fontSize: "0.85rem" }}>Enabled</MenuItem>
            <MenuItem value="Disabled" sx={{ fontSize: "0.85rem" }}>Disabled</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  </>
);

export default ServiceZonesConfig;
