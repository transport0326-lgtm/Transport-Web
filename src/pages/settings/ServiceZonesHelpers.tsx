import { Typography } from "@mui/material";

export interface Zone {
  _id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  areaCoverage: number | null;
  maxActiveRiders: number | null;
  minOrderValue: number | null;
  baseDeliveryFee: number | null;
  perKmRate: number | null;
  description: string | null;
  activeRiders: number;
  totalRiders: number;
  createdAt: string;
  updatedAt: string;
}

export const configFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.85rem",
    bgcolor: "#f9f9f9",
    "& fieldset": { borderColor: "#e8e8e8" },
    "&:hover fieldset": { borderColor: "#bbb" },
    "&.Mui-focused fieldset": { borderColor: "#0D1B3E" },
  },
};

export const addFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.85rem",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#0D1B3E" },
    "&.Mui-focused fieldset": { borderColor: "#0D1B3E" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.78rem" },
};

export const getAddFieldSx = (hasError = false) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.85rem",
    bgcolor: "#fff",
    "& fieldset": { borderColor: hasError ? "#fca5a5" : "#e0e0e0" },
    "&:hover fieldset": { borderColor: hasError ? "#dc2626" : "#0D1B3E" },
    "&.Mui-focused fieldset": { borderColor: hasError ? "#dc2626" : "#0D1B3E" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.78rem" },
});

export const errText = (msg?: string) =>
  msg ? (
    <Typography sx={{ fontSize: "0.68rem", color: "#dc2626", mt: 0.4 }}>
      {msg}
    </Typography>
  ) : null;
