import React from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AddNewRiderSectionHeader from "./AddNewRiderSectionHeader";
import {
  EMAIL_MAX,
  NAME_MAX,
  fieldSx,
  type FormErrors,
  type FormShape,
  type Touched,
} from "./AddNewRiderHelpers";

interface AddNewRiderPersonalInfoProps {
  form: FormShape;
  errors: FormErrors;
  touched: Touched;
  onChange: (key: keyof FormShape) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (key: keyof FormShape) => () => void;
}

const AddNewRiderPersonalInfo: React.FC<AddNewRiderPersonalInfoProps> = ({
  form,
  errors,
  touched,
  onChange,
  onBlur,
}) => (
  <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
    <AddNewRiderSectionHeader
      icon={<PersonIcon sx={{ fontSize: 16 }} />}
      title="Personal Information"
    />
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
      <TextField
        label="Full Name"
        required
        placeholder="Enter full name"
        size="small"
        fullWidth
        value={form.name}
        onChange={onChange("name")}
        onBlur={onBlur("name")}
        error={touched.name && !!errors.name}
        helperText={
          touched.name && errors.name
            ? errors.name
            : `${form.name.length}/${NAME_MAX}`
        }
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ fontSize: 15, color: "#d1d5db" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={fieldSx}
      />
      <TextField
        label="Phone Number"
        required
        placeholder="9876543210"
        size="small"
        fullWidth
        value={form.phone}
        onChange={onChange("phone")}
        onBlur={onBlur("phone")}
        error={touched.phone && !!errors.phone}
        helperText={touched.phone ? errors.phone : ""}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon sx={{ fontSize: 15, color: "#d1d5db" }} />
              </InputAdornment>
            ),
          },
          htmlInput: { maxLength: 10 },
        }}
        sx={fieldSx}
      />
      <TextField
        label="Email Address"
        required
        placeholder="rider@gmail.com"
        size="small"
        fullWidth
        value={form.email}
        onChange={onChange("email")}
        onBlur={(e) => {
          onBlur("email")();
          (e.target as HTMLInputElement).scrollLeft = 0;
        }}
        error={touched.email && !!errors.email}
        helperText={
          touched.email && errors.email
            ? errors.email
            : `${form.email.length}/${EMAIL_MAX}`
        }
        title={form.email}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ fontSize: 15, color: "#d1d5db" }} />
              </InputAdornment>
            ),
          },
          htmlInput: {
            maxLength: EMAIL_MAX,
            style: { textOverflow: "ellipsis" },
          },
        }}
        sx={{ ...fieldSx, gridColumn: "1 / -1" }}
      />
    </Box>
  </Box>
);

export default AddNewRiderPersonalInfo;
