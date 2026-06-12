import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/stores/store";
import { createZone } from "../../redux/sagas/riderManagement/createZoneWithRiderAction";
import { clearCreateZone } from "../../redux/slices/createZoneWithRiderSlice";
import {
  Box,
  Typography,
  Button,
  Chip,
  OutlinedInput,
  Dialog,
  Switch,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import GppGoodIcon from "@mui/icons-material/GppGood";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import RouteIcon from "@mui/icons-material/Route";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

interface CreateZoneModalProps {
  open: boolean;
  onClose: () => void;
  riderName: string;
  riderId: string;
}

const CreateZoneModal = ({ open, onClose, riderName, riderId }: CreateZoneModalProps) => {
  const dispatch = useDispatch();
  const [zoneActive, setZoneActive] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    areaCoverage: "",
    maxActiveRiders: "",
    minOrderValue: "",
    baseDeliveryFee: "",
    perKmRate: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { loading, success, error } = useSelector(
    (state: RootState) => state.createZone,
  );

  const handleChange = (field: string, value: string) => {
    const numericFields = [
      "maxActiveRiders",
      "minOrderValue",
      "baseDeliveryFee",
      "perKmRate",
    ];
    if (numericFields.includes(field)) {
      if (value !== "" && !/^\d+$/.test(value)) return;
      if (value.length > 6) return;
    }
    if (field === "state" && value && !/^[a-zA-Z\s]*$/.test(value)) return;
    if ((field === "name" || field === "city") && value && !/^[a-zA-Z0-9\s]*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const name = formData.name.trim();
    if (!name) newErrors.name = "Zone Name is required.";
    else if (name.length < 3) newErrors.name = "Zone Name must be at least 3 characters.";
    else if (name.length > 40) newErrors.name = "Zone Name must be at most 40 characters.";
    else if (!/^[a-zA-Z0-9\s]+$/.test(name)) newErrors.name = "Zone Name can only contain letters, numbers and spaces.";

    const city = formData.city.trim();
    if (!city) newErrors.city = "City is required.";
    else if (city.length < 3) newErrors.city = "City must be at least 3 characters.";
    else if (city.length > 40) newErrors.city = "City must be at most 40 characters.";
    else if (!/^[a-zA-Z0-9\s]+$/.test(city)) newErrors.city = "City can only contain letters, numbers and spaces.";

    const state = formData.state.trim();
    if (!state) newErrors.state = "State is required.";
    else if (state.length < 3) newErrors.state = "State must be at least 3 characters.";
    else if (state.length > 40) newErrors.state = "State must be at most 40 characters.";
    else if (!/^[a-zA-Z\s]+$/.test(state)) newErrors.state = "State can only contain letters and spaces.";

    if (formData.areaCoverage.trim() !== "") {
      if (!/^[a-zA-Z0-9\s]+$/.test(formData.areaCoverage.trim())) {
        newErrors.areaCoverage = "Only letters, digits and spaces allowed.";
      }
    }
    const numericFields: { key: keyof typeof formData; label: string }[] = [
      { key: "maxActiveRiders", label: "Max Active Riders" },
      { key: "minOrderValue", label: "Min Order Value" },
      { key: "baseDeliveryFee", label: "Base Delivery Fee" },
      { key: "perKmRate", label: "Per KM Rate" },
    ];
    numericFields.forEach(({ key, label }) => {
      const val = formData[key];
      if (val === "" || Number(val) === 0)
        newErrors[key] = `${label} is required and must be greater than 0.`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (success) {
      dispatch(clearCreateZone());
      onClose();
    }
  }, [success]);

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch(
      createZone({
        name: formData.name,
        city: formData.city,
        state: formData.state,
        areaCoverage: Number(formData.areaCoverage),
        maxActiveRiders: Number(formData.maxActiveRiders),
        minOrderValue: Number(formData.minOrderValue),
        baseDeliveryFee: Number(formData.baseDeliveryFee),
        perKmRate: Number(formData.perKmRate),
        description: formData.description,
        isActive: zoneActive,
        riderId,
      }),
    );
  };

  const fieldLabel = (text: string) => (
    <Typography sx={{ fontSize: "0.74rem", fontWeight: 600, color: "#374151", mb: 0.5 }}>
      {text}
    </Typography>
  );

  const errText = (field: string) =>
    errors[field] ? (
      <Typography sx={{ fontSize: "0.68rem", color: "#dc2626", mt: 0.4 }}>
        {errors[field]}
      </Typography>
    ) : null;

  const inputSx = (field: string) => ({
    fontSize: "0.82rem",
    borderRadius: 2,
    "& fieldset": { borderColor: errors[field] ? "#fca5a5" : "#e5e7eb" },
    "&:hover fieldset": { borderColor: errors[field] ? "#dc2626" : "#cbd5e1" },
    "&.Mui-focused fieldset": { borderColor: errors[field] ? "#dc2626" : undefined },
  });

  const charCount = (field: "name" | "city" | "state") => (
    <Typography
      sx={{
        fontSize: "0.65rem",
        color: formData[field].length > 35 ? "#d97706" : "#9ca3af",
        textAlign: "right",
        mt: 0.3,
      }}
    >
      {formData[field].length}/40
    </Typography>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          width: 520,
          borderRadius: 3,
          overflow: "hidden",
          m: 2,
          p: 1,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#0D1B3E",
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              bgcolor: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <MyLocationIcon sx={{ fontSize: 17, color: "#E8490F" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
              Create New Zone
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", mt: 0.2 }}>
              {riderName} will be added automatically.
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "rgba(255,255,255,0.55)",
            bgcolor: "rgba(255,255,255,0.08)",
            width: 28,
            height: 28,
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* Rider banner */}
      <Box
        sx={{
          bgcolor: "#e0f2fe",
          px: 2.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #bae6fd",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GppGoodIcon sx={{ fontSize: 15, color: "#E8490F" }} />
          <Typography sx={{ fontSize: "0.76rem", color: "#1e40af" }}>
            Adding: <strong>{riderName}</strong>
          </Typography>
        </Box>
        <Chip
          label="Auto-added"
          size="small"
          sx={{
            fontSize: "0.6rem",
            fontWeight: 700,
            height: 19,
            bgcolor: "#0D1B3E",
            color: "#fff",
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>

      {/* Form body */}
      <Box sx={{ px: 2.5, pt: 2, pb: 1, maxHeight: "62vh", overflowY: "auto" }}>
        <Box sx={{ mb: 2 }}>
          {fieldLabel("Zone Name *")}
          <OutlinedInput
            fullWidth size="small" placeholder="e.g. Khidderpore"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            inputProps={{ maxLength: 40 }}
            sx={inputSx("name")}
          />
          {errText("name")}
          {charCount("name")}
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            {fieldLabel("State *")}
            <OutlinedInput
              fullWidth size="small" placeholder="e.g. West Bengal"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              inputProps={{ maxLength: 40 }}
              startAdornment={
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ fontSize: 15, color: "#E8490F" }} />
                </InputAdornment>
              }
              sx={inputSx("state")}
            />
            {errText("state")}
            {charCount("state")}
          </Box>
          <Box sx={{ flex: 1 }}>
            {fieldLabel("City *")}
            <OutlinedInput
              fullWidth size="small" placeholder="e.g. Kolkata"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              inputProps={{ maxLength: 40 }}
              startAdornment={
                <InputAdornment position="start">
                  <BusinessIcon sx={{ fontSize: 15, color: "#3b82f6" }} />
                </InputAdornment>
              }
              sx={inputSx("city")}
            />
            {errText("city")}
            {charCount("city")}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
           <Box sx={{ mb: 2 }}>
          {fieldLabel("Area Coverage")}
          <OutlinedInput
            fullWidth size="small" placeholder="e.g. 5th block to 6th block"
            value={formData.areaCoverage}
            onChange={(e) => handleChange("areaCoverage", e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <RouteIcon sx={{ fontSize: 15, color: "#9ca3af" }} />
              </InputAdornment>
            }
            sx={inputSx("areaCoverage")}
          />
          {errText("areaCoverage")}
        </Box>
          <Box sx={{ flex: 1 }}>
            {fieldLabel("Max Active Riders")}
            <OutlinedInput
              fullWidth size="small" placeholder="e.g. 25"
              value={formData.maxActiveRiders}
              onChange={(e) => handleChange("maxActiveRiders", e.target.value)}
              inputProps={{ inputMode: "numeric" }}
              startAdornment={
                <InputAdornment position="start">
                  <PeopleAltIcon sx={{ fontSize: 15, color: "#9ca3af" }} />
                </InputAdornment>
              }
              sx={inputSx("maxActiveRiders")}
            />
            {errText("maxActiveRiders")}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            {fieldLabel("Base Delivery Fee (₹)")}
            <OutlinedInput
              fullWidth size="small" placeholder="e.g. 20"
              value={formData.baseDeliveryFee}
              onChange={(e) => handleChange("baseDeliveryFee", e.target.value)}
              inputProps={{ inputMode: "numeric" }}
              startAdornment={
                <InputAdornment position="start">
                  <LocalShippingIcon sx={{ fontSize: 15, color: "#9ca3af" }} />
                </InputAdornment>
              }
              sx={inputSx("baseDeliveryFee")}
            />
            {errText("baseDeliveryFee")}
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          {fieldLabel("Zone Description (optional)")}
          <OutlinedInput
            fullWidth multiline rows={3}
            placeholder="Brief description..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            sx={{ ...inputSx("description"), fontSize: "0.8rem" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            bgcolor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 2,
            px: 2,
            py: 1.2,
            mb: 2,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 20, color: "#16a34a", flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#16a34a", lineHeight: 1.3 }}>
              Zone Status: {zoneActive ? "Active" : "Inactive"}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "#6b7280" }}>
              Zone will be live immediately after creation.
            </Typography>
          </Box>
          <Switch
            checked={zoneActive}
            onChange={(e) => setZoneActive(e.target.checked)}
            size="small"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#16a34a" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#16a34a" },
            }}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ display: "flex", flexDirection: "column", px: 2.5, py: 2, borderTop: "1px solid #f3f4f6" }}>
        {error && (
          <Typography sx={{ fontSize: "0.75rem", color: "#dc2626", mb: 1, textAlign: "center" }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            fullWidth onClick={onClose}
            sx={{
              textTransform: "none", fontWeight: 600, fontSize: "0.85rem",
              color: "#374151", border: "1px solid #e5e7eb", borderRadius: 2, py: 1,
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth variant="contained" disableElevation
            disabled={loading} onClick={handleSubmit}
            startIcon={<GppGoodIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              textTransform: "none", fontWeight: 600, fontSize: "0.85rem",
              bgcolor: "#E8490F", borderRadius: 2, py: 1,
              "&:hover": { bgcolor: "#c93d0c" },
            }}
          >
            {loading ? "Creating..." : "Create Zone & Add Partner"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CreateZoneModal;
