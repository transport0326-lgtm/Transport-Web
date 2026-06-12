import React from "react";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BadgeIcon from "@mui/icons-material/Badge";
import AddNewRiderSectionHeader from "./AddNewRiderSectionHeader";
import AddNewRiderUploadBox from "./AddNewRiderUploadBox";
import {
  fieldSx,
  vehicleTypes,
  type FormErrors,
  type FormShape,
  type Touched,
} from "./AddNewRiderHelpers";
import type { Zone } from "../../redux/slices/serviceZonesSlice";

interface AddNewRiderDetailsProps {
  form: FormShape;
  errors: FormErrors;
  touched: Touched;
  vehicle: string;
  setVehicle: (v: string) => void;
  zoneId: string;
  setZoneId: (id: string) => void;
  zones: Zone[];
  dlFile: File | null;
  rcFile: File | null;
  fileErrors: { dl?: string; rc?: string };
  onDlFile: (f: File) => void;
  onRcFile: (f: File) => void;
  onChange: (key: keyof FormShape) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (key: keyof FormShape) => () => void;
}

const AddNewRiderDetails: React.FC<AddNewRiderDetailsProps> = ({
  form,
  errors,
  touched,
  vehicle,
  setVehicle,
  zoneId,
  setZoneId,
  zones,
  dlFile,
  rcFile,
  fileErrors,
  onDlFile,
  onRcFile,
  onChange,
  onBlur,
}) => (
  <Box sx={{ px: 3, pt: 2.5, pb: 2.5 }}>
    <AddNewRiderSectionHeader
      icon={<DirectionsBikeIcon sx={{ fontSize: 16 }} />}
      title="Partner Details"
    />

    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 1 }}>
      Vehicle Type <span style={{ color: "#ef4444" }}>*</span>
    </Typography>
    <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
      {vehicleTypes.map((v) => {
        const isActive = vehicle === v.key;
        return (
          <Button
            key={v.key}
            size="small"
            startIcon={v.icon}
            onClick={() => setVehicle(v.key)}
            sx={{
              fontSize: "0.78rem",
              fontWeight: isActive ? 700 : 500,
              textTransform: "none",
              borderRadius: 1.5,
              px: 1.8,
              py: 0.6,
              border: `1px solid ${isActive ? "#E8490F" : "#e5e7eb"}`,
              bgcolor: isActive ? "#E8490F" : "#fff",
              color: isActive ? "#fff" : "#374151",
              "&:hover": {
                bgcolor: isActive ? "#c93d0c" : "#f9fafb",
                borderColor: isActive ? "#c93d0c" : "#d1d5db",
              },
            }}
          >
            {v.label}
          </Button>
        );
      })}
    </Box>

    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
      <TextField
        label="Vehicle Number"
        required
        placeholder="e.g. WB20AB1234"
        size="small"
        fullWidth
        value={form.vehicleNumber}
        onChange={onChange("vehicleNumber")}
        onBlur={onBlur("vehicleNumber")}
        error={touched.vehicleNumber && !!errors.vehicleNumber}
        helperText={touched.vehicleNumber ? errors.vehicleNumber : ""}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <CreditCardIcon sx={{ fontSize: 15, color: "#d1d5db" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={fieldSx}
      />
      <TextField
        label="Driving License (DL) Number"
        required
        placeholder="e.g. WB0120230012345"
        size="small"
        fullWidth
        value={form.dlNumber}
        onChange={onChange("dlNumber")}
        onBlur={onBlur("dlNumber")}
        error={touched.dlNumber && !!errors.dlNumber}
        helperText={touched.dlNumber ? errors.dlNumber : ""}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <BadgeIcon sx={{ fontSize: 15, color: "#d1d5db" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={fieldSx}
      />
    </Box>

    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
      <Box>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
          DL Photo <span style={{ color: "#ef4444" }}>*</span>
        </Typography>
        <AddNewRiderUploadBox
          label="Upload DL Photo"
          required
          file={dlFile}
          onFile={onDlFile}
        />
        {fileErrors.dl && (
          <Typography sx={{ fontSize: "0.7rem", color: "#d32f2f", mt: 0.5 }}>
            {fileErrors.dl}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <TextField
          label="RC Card Number"
          required
          placeholder="e.g. WB20AB1234"
          size="small"
          fullWidth
          value={form.rcNumber}
          onChange={onChange("rcNumber")}
          onBlur={onBlur("rcNumber")}
          error={touched.rcNumber && !!errors.rcNumber}
          helperText={touched.rcNumber ? errors.rcNumber : ""}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon sx={{ fontSize: 15, color: "#d1d5db" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={fieldSx}
        />
        <Box>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
            RC Card Photo <span style={{ color: "#ef4444" }}>*</span>
          </Typography>
          <AddNewRiderUploadBox
            label="Upload RC Card Photo"
            required
            file={rcFile}
            onFile={onRcFile}
          />
          {fileErrors.rc && (
            <Typography sx={{ fontSize: "0.7rem", color: "#d32f2f", mt: 0.5 }}>
              {fileErrors.rc}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>

    <TextField
      select
      label="Service Zone"
      required
      size="small"
      fullWidth
      value={zoneId}
      onChange={(e) => setZoneId(e.target.value)}
      sx={fieldSx}
    >
      {zones.map((z) => (
        <MenuItem key={z._id} value={z._id} sx={{ fontSize: "0.83rem" }}>
          {z.name} — {z.city}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);

export default AddNewRiderDetails;
