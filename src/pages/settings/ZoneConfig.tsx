import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Switch, Button, FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchZoneConfig,
  updateZoneConfig,
} from "../../redux/sagas/serviceZones/zoneConfigAction";
import type { RootState } from "../../redux/stores/store";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.85rem",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#bbb" },
    "&.Mui-focused fieldset": { borderColor: "#0D1B3E" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.78rem", color: "#aaa" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0D1B3E" },
  "& .MuiFormHelperText-root": { fontSize: "0.68rem", mx: 0, mt: 0.4 },
};

const switchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: "#0D1B3E" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0D1B3E" },
};

const ZoneConfig: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => state.zoneConfig);
  const config = data?.zoneConfig;

  const [defaultRadiusKm, setDefaultRadiusKm] = useState("");
  const [overlapAllowed, setOverlapAllowed] = useState(false);
  const [autoExpand, setAutoExpand] = useState(false);
  const [radiusError, setRadiusError] = useState("");

  useEffect(() => {
    dispatch(fetchZoneConfig());
  }, [dispatch]);

  useEffect(() => {
    if (config) {
      setDefaultRadiusKm(String(config.defaultRadiusKm));
      setOverlapAllowed(config.overlapAllowed);
      setAutoExpand(config.autoExpandOnHighDemand);
    }
  }, [config]);

  const handleSave = () => {
    const radius = parseFloat(defaultRadiusKm);
    if (isNaN(radius) || radius <= 0) {
      setRadiusError("Enter a valid radius greater than 0");
      return;
    }
    setRadiusError("");
    dispatch(updateZoneConfig({ defaultRadiusKm: radius, overlapAllowed, autoExpandOnHighDemand: autoExpand }));
  };

  const handleCancel = () => {
    if (config) {
      setDefaultRadiusKm(String(config.defaultRadiusKm));
      setOverlapAllowed(config.overlapAllowed);
      setAutoExpand(config.autoExpandOnHighDemand);
      setRadiusError("");
    }
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#1a1a2e", mb: 0.5 }}>
        Zone Configuration
      </Typography>
      <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", mb: 3 }}>
        Global settings applied across all service zones.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 480 }}>
        <TextField
          label="Default Radius (km)"
          value={defaultRadiusKm}
          onChange={(e) => {
            setDefaultRadiusKm(e.target.value.replace(/[^0-9.]/g, ""));
            if (radiusError) setRadiusError("");
          }}
          size="small"
          fullWidth
          type="number"
          error={!!radiusError}
          helperText={radiusError || "Default coverage radius applied to new zones"}
          sx={fieldSx}
        />

        <Box sx={{ border: "1px solid #e5e7eb", borderRadius: 1.5, px: 2, py: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={overlapAllowed}
                onChange={(e) => setOverlapAllowed(e.target.checked)}
                size="small"
                sx={switchSx}
              />
            }
            label={
              <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1a1a2e" }}>
                  Allow Zone Overlap
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                  Zones can share geographic boundaries with each other
                </Typography>
              </Box>
            }
            sx={{ m: 0, gap: 1.5, alignItems: "flex-start" }}
          />
        </Box>

        <Box sx={{ border: "1px solid #e5e7eb", borderRadius: 1.5, px: 2, py: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoExpand}
                onChange={(e) => setAutoExpand(e.target.checked)}
                size="small"
                sx={switchSx}
              />
            }
            label={
              <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1a1a2e" }}>
                  Auto Expand on High Demand
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                  Automatically expand zone coverage radius during peak hours
                </Typography>
              </Box>
            }
            sx={{ m: 0, gap: 1.5, alignItems: "flex-start" }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            textTransform: "none", borderColor: "#ddd", color: "#555",
            fontSize: "0.85rem", borderRadius: 2, px: 3,
            "&:hover": { borderColor: "#bbb", bgcolor: "#fafafa" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSave}
          disabled={loading}
          sx={{
            textTransform: "none", bgcolor: "#E8490F", color: "#fff",
            fontSize: "0.85rem", fontWeight: 600, borderRadius: 2, px: 3,
            "&:hover": { bgcolor: "#c93d0c" },
          }}
        >
          {loading ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default ZoneConfig;
