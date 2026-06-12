import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export const NAME_MAX = 30;
export const EMAIL_MAX = 100;

export const vehicleTypes = [
  {
    key: "Bike",
    apiKey: "bike",
    icon: <TwoWheelerIcon sx={{ fontSize: 15 }} />,
    label: "Bike",
  },
  {
    key: "Auto",
    apiKey: "auto",
    icon: (
      <img
        src="./auto.png"
        style={{ width: 15, height: 15, objectFit: "contain", color: "black" }}
      />
    ),
    label: "Auto",
  },
  {
    key: "Mini Truck",
    apiKey: "mini_truck",
    icon: <DirectionsCarIcon sx={{ fontSize: 15 }} />,
    label: "Mini Truck",
  },
  {
    key: "Truck",
    apiKey: "truck",
    icon: <LocalShippingIcon sx={{ fontSize: 15 }} />,
    label: "Truck",
  },
];

export const emptyForm = {
  name: "",
  email: "",
  phone: "",
  vehicleNumber: "",
  dlNumber: "",
  rcNumber: "",
  currentAddress: "",
};

export type FormShape = typeof emptyForm;
export type FormErrors = Partial<Record<keyof FormShape, string>>;
export type Touched = Partial<Record<keyof FormShape, boolean>>;

export const DEFAULT_CENTER = { lat: 22.5726, lng: 88.3639 };
export const LIBRARIES: "places"[] = ["places"];
export const MAP_CONTAINER = { width: "100%", height: "200px" };

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.83rem",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#d1d5db" },
    "&.Mui-focused fieldset": { borderColor: "#E8490F" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.82rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#E8490F" },
};

export const validateName = (v: string) => {
  if (!v.trim()) return "Full name is required";
  if (v.trim().length < 2) return "Name must be at least 2 characters";
  if (v.length > NAME_MAX) return `Name cannot exceed ${NAME_MAX} characters`;
  if (!/^[a-zA-Z\s'-]+$/.test(v))
    return "Name can only contain letters, spaces, hyphens or apostrophes";
  return "";
};

export const validatePhone = (v: string) => {
  if (!v.trim()) return "Phone number is required";
  if (!/^[0-9]{10}$/.test(v)) return "Enter a valid 10-digit phone number";
  return "";
};

export const validateEmail = (v: string) => {
  if (!v.trim()) return "Email address is required";
  if (v.length > EMAIL_MAX)
    return `Email cannot exceed ${EMAIL_MAX} characters`;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return "Enter a valid email address";
  return "";
};

export const validateVehicleNumber = (v: string) => {
  if (!v.trim()) return "Vehicle number is required";
  const clean = v.replace(/[-\s]/g, "").toUpperCase();
  if (!/^([A-Z]{2}\d{2}[A-Z]{1,3}\d{4}|\d{2}BH\d{4}[A-Z]{2})$/.test(clean))
    return "Enter a valid vehicle number (e.g. WB20AB1234)";
  return "";
};

export const validateDLNumber = (v: string) => {
  if (!v.trim()) return "DL number is required";
  const clean = v.replace(/[-\s]/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{11,13}$/.test(clean))
    return "Enter a valid DL number (e.g. WB0120230012345)";
  return "";
};

export const validateRCNumber = (v: string) => {
  if (!v.trim()) return "RC number is required";
  const clean = v.replace(/[-\s]/g, "").toUpperCase();
  if (!/^([A-Z]{2}\d{2}[A-Z]{1,3}\d{4}|\d{2}BH\d{4}[A-Z]{2})$/.test(clean))
    return "Enter a valid RC number (e.g. WB20AB1234)";
  return "";
};

export const validateField = (
  key: keyof FormShape,
  value: string,
): string => {
  if (key === "name") return validateName(value);
  if (key === "phone") return validatePhone(value);
  if (key === "email") return validateEmail(value);
  if (key === "vehicleNumber") return validateVehicleNumber(value);
  if (key === "dlNumber") return validateDLNumber(value);
  if (key === "rcNumber") return validateRCNumber(value);
  return "";
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
