import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { createServiceZone } from "../../redux/sagas/serviceZones/createServiceZoneAction";
import { addFieldSx, errText, getAddFieldSx } from "./ServiceZonesHelpers";

interface ServiceZonesAddViewProps {
  onBack: () => void;
}

const ServiceZonesAddView: React.FC<ServiceZonesAddViewProps> = ({ onBack }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    areaCoverage: "",
    maxActiveRiders: "",
    minOrderValue: "",
    baseDeliveryFee: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (field === "state" && value && !/^[a-zA-Z\s]*$/.test(value)) return;
      if ((field === "name" || field === "city") && value && !/^[a-zA-Z0-9\s]*$/.test(value)) return;
      if (["areaCoverage", "maxActiveRiders", "minOrderValue", "baseDeliveryFee"].includes(field) && value && !/^\d*\.?\d*$/.test(value)) return;
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const name = formData.name.trim();
    if (!name) e.name = "Zone Name is required.";
    else if (name.length < 3) e.name = "Must be at least 3 characters.";
    else if (name.length > 40) e.name = "Must be at most 40 characters.";
    const city = formData.city.trim();
    if (!city) e.city = "City is required.";
    else if (city.length < 2) e.city = "Must be at least 2 characters.";
    const state = formData.state.trim();
    if (!state) e.state = "State is required.";
    else if (state.length < 2) e.state = "Must be at least 2 characters.";

    const area = formData.areaCoverage.trim();
    if (!area) e.areaCoverage = "Area Coverage is required.";
    else if (isNaN(Number(area))) e.areaCoverage = "Enter a valid number.";
    else if (Number(area) <= 0) e.areaCoverage = "Must be greater than 0.";
    else if (Number(area) > 1000) e.areaCoverage = "Must not exceed 1000.";

    const maxRiders = formData.maxActiveRiders.trim();
    if (!maxRiders) e.maxActiveRiders = "Max Active Riders is required.";
    else if (isNaN(Number(maxRiders))) e.maxActiveRiders = "Enter a valid number.";
    else if (Number(maxRiders) <= 0) e.maxActiveRiders = "Must be greater than 0.";
    else if (Number(maxRiders) > 1000) e.maxActiveRiders = "Must not exceed 1000.";

    const baseFee = formData.baseDeliveryFee.trim();
    if (!baseFee) e.baseDeliveryFee = "Base Delivery Fee is required.";
    else if (isNaN(Number(baseFee))) e.baseDeliveryFee = "Enter a valid number.";
    else if (Number(baseFee) <= 0) e.baseDeliveryFee = "Must be greater than 0.";
    else if (Number(baseFee) > 1000) e.baseDeliveryFee = "Must not exceed 1000.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch(
      createServiceZone({
        name: formData.name,
        city: formData.city,
        state: formData.state,
        areaCoverage: parseFloat(formData.areaCoverage),
        maxActiveRiders: formData.maxActiveRiders
          ? parseFloat(formData.maxActiveRiders)
          : undefined,
        minOrderValue: formData.minOrderValue
          ? parseFloat(formData.minOrderValue)
          : undefined,
        baseDeliveryFee: formData.baseDeliveryFee
          ? parseFloat(formData.baseDeliveryFee)
          : undefined,
        description: formData.description || undefined,
        isActive: formData.isActive,
      }),
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
          Add New Zone
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af", mb: 3, ml: 4.5 }}>
        Define a new delivery zone with coverage area and settings
      </Typography>

      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
          Zone Name
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="e.g., Koramangala"
          value={formData.name}
          onChange={handleChange("name")}
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
            placeholder="e.g., Bangalore"
            value={formData.city}
            onChange={handleChange("city")}
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
            placeholder="e.g., Karnataka"
            value={formData.state}
            onChange={handleChange("state")}
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
            placeholder="e.g., 12.5"
            value={formData.areaCoverage}
            onChange={handleChange("areaCoverage")}
            sx={getAddFieldSx(!!errors.areaCoverage)}
          />
          {errText(errors.areaCoverage)}
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
            Max Active Partners
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g., 20"
            value={formData.maxActiveRiders}
            onChange={handleChange("maxActiveRiders")}
            sx={getAddFieldSx(!!errors.maxActiveRiders)}
          />
          {errText(errors.maxActiveRiders)}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
            Base Delivery Fee (₹)
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g., 30"
            value={formData.baseDeliveryFee}
            onChange={handleChange("baseDeliveryFee")}
            sx={getAddFieldSx(!!errors.baseDeliveryFee)}
          />
          {errText(errors.baseDeliveryFee)}
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
          placeholder="Describe the zone boundaries and coverage area..."
          value={formData.description}
          onChange={handleChange("description")}
          sx={addFieldSx}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
          Zone Status
        </Typography>
        <Switch
          checked={formData.isActive}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
          }
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
            color: formData.isActive ? "#16a34a" : "#9ca3af",
            fontWeight: 500,
          }}
        >
          {formData.isActive ? "Active" : "Inactive"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
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
          startIcon={<AddIcon />}
          onClick={handleSubmit}
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
          Add Zone
        </Button>
      </Box>
    </Box>
  );
};

export default ServiceZonesAddView;
