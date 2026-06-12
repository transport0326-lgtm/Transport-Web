import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface AddNewRiderUploadBoxProps {
  label: string;
  required?: boolean;
  file?: File | null;
  onFile?: (f: File) => void;
}

const AddNewRiderUploadBox: React.FC<AddNewRiderUploadBoxProps> = ({
  label,
  required = false,
  file,
  onFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Box
      onClick={() => inputRef.current?.click()}
      sx={{
        border: `2px dashed ${file ? "#16a34a" : "#d1d5db"}`,
        borderRadius: 2,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        cursor: "pointer",
        bgcolor: file ? "#f0fdf4" : "#fafafa",
        "&:hover": {
          borderColor: file ? "#16a34a" : "#E8490F",
          bgcolor: file ? "#dcfce7" : "#fff8f6",
        },
        transition: "all 0.15s",
        minHeight: 90,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile?.(f);
        }}
      />
      {file ? (
        <>
          <CheckCircleIcon sx={{ fontSize: 26, color: "#16a34a" }} />
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "#16a34a",
              textAlign: "center",
              wordBreak: "break-all",
              px: 1,
            }}
          >
            {file.name}
          </Typography>
        </>
      ) : (
        <>
          <CloudUploadIcon sx={{ fontSize: 26, color: "#E8490F" }} />
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#E8490F" }}>
            {label}
            {required && " *"}
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: "#9ca3af", textAlign: "center" }}>
            JPG, PNG or PDF • Max 5MB
          </Typography>
        </>
      )}
    </Box>
  );
};

export default AddNewRiderUploadBox;
