import React, { useState } from "react";
import { Box, Button, OutlinedInput, Typography } from "@mui/material";
import { colors } from "../../theme/colors";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  presetLimits?: number[];
  minLimit?: number;
  maxLimit?: number;
}

const DEFAULT_PRESETS = [10, 15, 25];

const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
  presetLimits = DEFAULT_PRESETS,
  minLimit = 1,
  maxLimit = 200,
}) => {
  const [customInput, setCustomInput] = useState("");

  const applyCustomLimit = () => {
    const n = parseInt(customInput, 10);
    if (!isNaN(n) && n >= minLimit && n <= maxLimit) {
      onLimitChange(n);
      setCustomInput("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: "0.75rem", color: colors.neutral.textSubtle }}>
          Rows per page:
        </Typography>
        {presetLimits.map((n) => (
          <Button
            key={n}
            size="small"
            onClick={() => onLimitChange(n)}
            sx={{
              minWidth: 32,
              fontSize: "0.75rem",
              textTransform: "none",
              borderRadius: 1.5,
              px: 1.2,
              py: 0.3,
              border: "1px solid",
              borderColor: limit === n ? colors.brand.secondary : colors.neutral.border,
              bgcolor: limit === n ? colors.brand.secondary : "transparent",
              color: limit === n ? "#fff" : "#555",
              "&:hover": {
                bgcolor: limit === n ? colors.brand.secondaryHover : colors.neutral.bgMuted,
              },
            }}
          >
            {n}
          </Button>
        ))}
        <OutlinedInput
          size="small"
          placeholder="Custom"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyCustomLimit();
          }}
          onBlur={applyCustomLimit}
          sx={{
            width: 72,
            height: 28,
            fontSize: "0.75rem",
            borderRadius: 1.5,
            "& fieldset": { borderColor: colors.neutral.border },
            "& input": { py: 0.5, px: 1, textAlign: "center" },
          }}
        />
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontSize: "0.75rem", color: colors.neutral.textSubtle }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            size="small"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            sx={{
              fontSize: "0.75rem",
              textTransform: "none",
              color: "#555",
              border: `1px solid ${colors.neutral.border}`,
              borderRadius: 1.5,
              px: 1.5,
              py: 0.3,
              minWidth: 0,
              "&:hover": { bgcolor: colors.neutral.bgMuted },
              "&.Mui-disabled": { color: "#ccc", borderColor: "#eee" },
            }}
          >
            ← Prev
          </Button>
          <Button
            size="small"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            sx={{
              fontSize: "0.75rem",
              textTransform: "none",
              color: "#fff",
              bgcolor: colors.brand.secondary,
              borderRadius: 1.5,
              px: 1.5,
              py: 0.3,
              minWidth: 0,
              "&:hover": { bgcolor: colors.brand.secondaryHover },
              "&.Mui-disabled": { bgcolor: "#e0e0e0", color: "#aaa" },
            }}
          >
            Next →
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TablePagination;
