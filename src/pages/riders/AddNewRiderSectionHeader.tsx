import React from "react";
import { Box, Typography } from "@mui/material";

interface AddNewRiderSectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const AddNewRiderSectionHeader: React.FC<AddNewRiderSectionHeaderProps> = ({
  icon,
  title,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
    <Box sx={{ color: "#E8490F", display: "flex", alignItems: "center" }}>
      {icon}
    </Box>
    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>
      {title}
    </Typography>
  </Box>
);

export default AddNewRiderSectionHeader;
