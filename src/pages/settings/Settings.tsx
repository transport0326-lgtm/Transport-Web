import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PricingRates from "./PricingRates";
import PlatformCommission from "./PlatformCommission";
import ServiceZones from "./ServiceZones";
import TeamRoles from "./TeamRoles";
import Security from "./Security";
import BillingPlan from "./BillingPlan";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AdminLayout from "../../components/layout/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyProfile,
  updateCompanyProfile,
} from "../../redux/sagas/companyProfile/companyProfileAction";
import type { RootState } from "../../redux/stores/store";

type Section =
  | "Company Profile"
  | "Pricing & Rates"
  | "Platform Commission"
  | "Service Zones"
  | "Zone Config"
  | "Team & Roles"
  | "Security"
  | "Billing & Plan";

const navItems: { label: Section; icon: React.ReactNode }[] = [
  { label: "Company Profile",    icon: <BusinessIcon fontSize="small" /> },
  { label: "Pricing & Rates",    icon: <LocalOfferIcon fontSize="small" /> },
  { label: "Platform Commission", icon: <AccountBalanceWalletIcon fontSize="small" /> },
  { label: "Service Zones",      icon: <LocationOnIcon fontSize="small" /> },
  // { label: "Zone Config",     icon: <TuneIcon fontSize="small" /> },
  // { label: 'Team & Roles',       icon: <GroupIcon fontSize="small" /> },
  // { label: 'Security',           icon: <LockIcon fontSize="small" /> },
  // { label: 'Billing & Plan',     icon: <ReceiptIcon fontSize="small" /> },
];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    fontSize: '0.85rem',
    bgcolor: '#fff',
    '& fieldset': { borderColor: '#e0e0e0' },
    '&:hover fieldset': { borderColor: '#bbb' },
    '&.Mui-focused fieldset': { borderColor: '#0D1B3E' },
  },
  '& .MuiInputLabel-root': { fontSize: '0.78rem', color: '#aaa' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#0D1B3E' },
  '& .MuiFormHelperText-root': { fontSize: '0.68rem', mx: 0, mt: 0.4 },
};

const CompanyProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(
    (state: RootState) => state.companyProfile,
  );

  const settings = data?.settings;

  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    phoneNumber: "",
    businessAddress: "",
    gstNumber: "",
    defaultCurrency: "",
  });

  useEffect(() => {
    dispatch(fetchCompanyProfile());
  }, []);

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName ?? "",
        contactEmail: settings.contactEmail ?? "",
        phoneNumber: settings.phoneNumber ?? "",
        businessAddress: settings.businessAddress ?? "",
        gstNumber: settings.gstNumber ?? "",
        defaultCurrency: settings.defaultCurrency ?? "",
      });
    }
  }, [settings]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Contact Email — standard email format
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail.trim())
    ) {
      newErrors.contactEmail = "Enter a valid email address.";
    }

    // Phone Number — Indian: 10 digits, starts with 6-9
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Enter a valid 10-digit Indian mobile number.";
    }

    // GST Number — Indian format: 2 digits + 10 char PAN + 1 digit + Z + 1 alphanumeric
    if (formData.gstNumber.trim() !== "") {
      if (
        !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          formData.gstNumber.trim().toUpperCase(),
        )
      ) {
        newErrors.gstNumber =
          "Enter a valid GST number (e.g. 22AAAAA0000A1Z5).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Phone: only digits, max 10
      if (field === "phoneNumber") {
        value = value.replace(/\D/g, "").slice(0, 10);
      }

      // GST: uppercase, max 15 chars
      if (field === "gstNumber") {
        value = value.toUpperCase().slice(0, 15);
      }

      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSave = () => {
    if (!validate()) return;
    dispatch(
      updateCompanyProfile({
        companyName: formData.companyName,
        contactEmail: formData.contactEmail,
        phoneNumber: formData.phoneNumber,
        businessAddress: formData.businessAddress,
        gstNumber: formData.gstNumber,
        defaultCurrency: formData.defaultCurrency,
      }),
    );
  };

  const handleCancel = () => {
    if (settings) {
      setFormData({
        companyName: settings.companyName ?? "",
        contactEmail: settings.contactEmail ?? "",
        phoneNumber: settings.phoneNumber ?? "",
        businessAddress: settings.businessAddress ?? "",
        gstNumber: settings.gstNumber ?? "",
        defaultCurrency: settings.defaultCurrency ?? "",
      });
    }
  };

  return (
    <Box>
      <Typography
        sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#1a1a2e", mb: 2.5 }}
      >
        Company Profile
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3.5 }}>
        <TextField
          label="Company Name"
          value={formData.companyName}
          onChange={handleChange("companyName")}
          fullWidth
          size="small"
          sx={fieldSx}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Contact Email"
            value={formData.contactEmail}
            onChange={handleChange("contactEmail")}
            fullWidth
            size="small"
            error={!!errors.contactEmail}
            helperText={errors.contactEmail}
            sx={fieldSx}
          />
          <TextField
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            fullWidth
            size="small"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 10 } }}
            sx={fieldSx}
          />
        </Box>

        <TextField
          label="Business Address"
          value={formData.businessAddress}
          onChange={handleChange("businessAddress")}
          fullWidth
          size="small"
          sx={fieldSx}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="GST Number"
            value={formData.gstNumber}
            onChange={handleChange("gstNumber")}
            fullWidth
            size="small"
            error={!!errors.gstNumber}
            helperText={errors.gstNumber}
           slotProps={{ htmlInput: { maxLength: 15 } }}
            sx={fieldSx}
          />
          <TextField
            label="Default Currency"
            value={formData.defaultCurrency}
            onChange={handleChange("defaultCurrency")}
            fullWidth
            size="small"
            sx={fieldSx}
          />
        </Box>
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 1 }}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
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
          disabled={loading}
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
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

const PlaceholderSection: React.FC<{ title: Section }> = ({ title }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 10,
    }}
  >
    <Typography
      sx={{ fontSize: "1rem", fontWeight: 600, color: "#1a1a2e", mb: 0.5 }}
    >
      {title}
    </Typography>
    <Typography sx={{ fontSize: "0.82rem", color: "#bbb" }}>
      This section is coming soon.
    </Typography>
  </Box>
);

const Settings: React.FC = () => {
  const [active, setActive] = useState<Section>("Company Profile");

  return (
    <AdminLayout pageTitle="Settings">
      <Box
        sx={{
          display: "flex",
          gap: 0,
          bgcolor: "#fff",
          border: "1px solid #eee",
          borderRadius: 2,
          overflow: "hidden",
          minHeight: 560,
        }}
      >
        {/* Left sub-nav */}
        <Box
          sx={{
            width: 210,
            flexShrink: 0,
            borderRight: "1px solid #f0f0f0",
            py: 1.5,
          }}
        >
          <List disablePadding>
            {navItems.map((item) => {
              const isActive = active === item.label;
              return (
                <ListItemButton
                  key={item.label}
                  onClick={() => setActive(item.label)}
                  sx={{
                    px: 2,
                    py: 1,
                    mx: 1,
                    borderRadius: 1.5,
                    mb: 0.3,
                    bgcolor: isActive ? "#fff5f2" : "transparent",
                    "&:hover": { bgcolor: isActive ? "#fff5f2" : "#fafafa" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 30,
                      color: isActive ? "#E8490F" : "#aaa",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "0.83rem",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#E8490F" : "#555",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Right content */}
        <Box sx={{ flex: 1, p: 3.5 }}>
          {active === "Company Profile" ? (
            <CompanyProfile />
          ) : active === "Pricing & Rates" ? (
            <PricingRates />
          ) : active === "Platform Commission" ? (
            <PlatformCommission />
          ) : active === "Service Zones" ? (
            <ServiceZones />
          ): active === "Team & Roles" ? (
            <TeamRoles />
          ) : active === "Security" ? (
            <Security />
          ) : active === "Billing & Plan" ? (
            <BillingPlan />
          ) : (
            <PlaceholderSection title={active} />
          )}
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default Settings;
