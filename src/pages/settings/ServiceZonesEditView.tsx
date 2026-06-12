import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { updateZone } from "../../redux/sagas/serviceZones/updateZoneSagaAction";
import { addFieldSx, errText, getAddFieldSx, type Zone } from "./ServiceZonesHelpers";

interface ServiceZonesEditViewProps {
  zone: Zone;
  onBack: () => void;
}

const ServiceZonesEditView: React.FC<ServiceZonesEditViewProps> = ({
  zone,
  onBack,
}) => {
  const [values, setValues] = useState({
    name: zone.name,
    city: zone.city,
    state: zone.state,
    area: String(zone.areaCoverage ?? ""),
    maxRiders: String(zone.maxActiveRiders ?? ""),
    minOrder: String(zone.minOrderValue ?? ""),
    baseFee: String(zone.baseDeliveryFee ?? ""),
    description: zone.description ?? "",
  });
  const [active, setActive] = useState(zone.isActive);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();

  const set =
    (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (key === "state" && value && !/^[a-zA-Z\s]*$/.test(value)) return;
      if ((key === "name" || key === "city") && value && !/^[a-zA-Z0-9\s]*$/.test(value)) return;
      if (["area", "maxRiders", "minOrder", "baseFee"].includes(key) && value && !/^\d*\.?\d*$/.test(value)) return;
      setValues((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const name = values.name.trim();
    if (!name) e.name = "Zone Name is required.";
    else if (name.length < 3) e.name = "Must be at least 3 characters.";
    else if (name.length > 40) e.name = "Must be at most 40 characters.";
    const city = values.city.trim();
    if (!city) e.city = "City is required.";
    else if (city.length < 2) e.city = "Must be at least 2 characters.";
    const state = values.state.trim();
    if (!state) e.state = "State is required.";
    else if (state.length < 2) e.state = "Must be at least 2 characters.";

    const area = values.area.trim();
    if (!area) e.area = "Area Coverage is required.";
    else if (isNaN(Number(area))) e.area = "Enter a valid number.";
    else if (Number(area) <= 0) e.area = "Must be greater than 0.";
    else if (Number(area) > 1000) e.area = "Must not exceed 1000.";

    const maxRiders = values.maxRiders.trim();
    if (!maxRiders) e.maxRiders = "Max Active Riders is required.";
    else if (isNaN(Number(maxRiders))) e.maxRiders = "Enter a valid number.";
    else if (Number(maxRiders) <= 0) e.maxRiders = "Must be greater than 0.";
    else if (Number(maxRiders) > 1000) e.maxRiders = "Must not exceed 1000.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    dispatch(
      updateZone({
        id: zone._id,
        data: {
          name: values.name,
          city: values.city,
          state: values.state,
          areaCoverage: values.area ? parseFloat(values.area) : undefined,
          maxActiveRiders: values.maxRiders ? parseFloat(values.maxRiders) : undefined,
          minOrderValue: values.minOrder ? parseFloat(values.minOrder) : undefined,
          baseDeliveryFee: values.baseFee ? parseFloat(values.baseFee) : undefined,
          description: values.description || undefined,
          isActive: active,
        },
      })
    );
    onBack();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.4 }}>
        <IconButton
          size="small"
          onClick={onBack}
          sx={{ color: "#374151", "&:hover": { bgcolor: "#f3f4f6" } }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1a1a2e" }}>
          Edit Zone — {zone.name}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af", mb: 3, ml: 4.5 }}>
        Update delivery zone configuration and boundaries
      </Typography>

      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
          Zone Name
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={values.name}
          onChange={set("name")}
          sx={getAddFieldSx(!!errors.name)}
        />
        {errText(errors.name)}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
            City
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={values.city}
            onChange={set("city")}
            sx={getAddFieldSx(!!errors.city)}
          />
          {errText(errors.city)}
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
            State
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={values.state}
            onChange={set("state")}
            sx={getAddFieldSx(!!errors.state)}
          />
          {errText(errors.state)}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
            Area Coverage (km²)
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={values.area}
            onChange={set("area")}
            sx={getAddFieldSx(!!errors.area)}
          />
          {errText(errors.area)}
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
            Max Active Partners
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={values.maxRiders}
            onChange={set("maxRiders")}
            sx={getAddFieldSx(!!errors.maxRiders)}
          />
          {errText(errors.maxRiders)}
        </Box>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
          Zone Description
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={values.description}
          onChange={set("description")}
          sx={addFieldSx}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
          Zone Status
        </Typography>
        <Switch
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              bgcolor: "#4caf50",
            },
          }}
        />
        <Typography
          sx={{
            fontSize: "0.82rem",
            color: active ? "#16a34a" : "#9ca3af",
            fontWeight: 500,
          }}
        >
          {active ? "Active" : "Inactive"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            textTransform: "none",
            borderColor: "#ddd",
            color: "#555",
            fontSize: "0.85rem",
            borderRadius: 2,
            px: 3,
            "&:hover": { borderColor: "#bbb", bgcolor: "#fafafa" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSave}
          sx={{
            textTransform: "none",
            bgcolor: "#E8490F",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            "&:hover": { bgcolor: "#c93d0c" },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ServiceZonesEditView;
