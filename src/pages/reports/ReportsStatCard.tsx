import React from "react";
import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface ReportsStatCardProps {
  label: string;
  value: string;
  changePercent?: number | null;
  changeSuffix?: string;
  loading?: boolean;
}

const ReportsStatCard: React.FC<ReportsStatCardProps> = ({
  label,
  value,
  changePercent,
  changeSuffix = "vs last period",
  loading,
}) => {
  const isPositive = changePercent != null && changePercent > 0;
  const isNegative = changePercent != null && changePercent < 0;
  const changeColor = isPositive ? "#43a047" : isNegative ? "#ef5350" : "#aaa";

  return (
    <Card elevation={0} sx={{ border: "1px solid #eee", borderRadius: 2, flex: 1 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography sx={{ fontSize: "0.72rem", color: "#aaa", mb: 0.8 }}>
          {label}
        </Typography>
        {loading ? (
          <>
            <Skeleton width="60%" height={36} />
            <Skeleton width="80%" height={16} sx={{ mt: 0.5 }} />
          </>
        ) : (
          <>
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#1a1a2e",
                lineHeight: 1.1,
              }}
            >
              {value}
            </Typography>
            {changePercent != null ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, mt: 0.5 }}>
                {isPositive && (
                  <TrendingUpIcon sx={{ fontSize: 13, color: changeColor }} />
                )}
                {isNegative && (
                  <TrendingDownIcon sx={{ fontSize: 13, color: changeColor }} />
                )}
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: changeColor,
                    fontWeight: 500,
                  }}
                >
                  {isPositive ? "+" : ""}
                  {changePercent}% {changeSuffix}
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ fontSize: "0.72rem", color: "#aaa", mt: 0.5 }}>
                No change data
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsStatCard;
