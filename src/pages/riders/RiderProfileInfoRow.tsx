import React from "react";
import { Box, Typography } from "@mui/material";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.4, mb: 1.6 }}>
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: 1.5,
        bgcolor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#6b7280",
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{ fontSize: "0.62rem", color: "#9ca3af", lineHeight: 1, mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography
        title={value}
        sx={{
          fontSize: "0.8rem",
          color: "#374151",
          fontWeight: 500,
          lineHeight: 1.3,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

export default InfoRow;
