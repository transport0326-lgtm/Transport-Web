import React from "react";
import { Box, Typography, Chip, Divider, Avatar } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { getInitials } from "../../utils/avatar";
import { formatDate } from "./RiderProfileHelpers";
import type { RiderCustomerFeedback } from "../../redux/slices/riderDetailSlice";

interface RiderProfileCustomerFeedbackProps {
  customerFeedback: RiderCustomerFeedback;
}

const RiderProfileCustomerFeedback: React.FC<RiderProfileCustomerFeedbackProps> = ({
  customerFeedback,
}) => (
  <Box
    sx={{
      bgcolor: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 2,
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2.5,
        py: 1.8,
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <StarIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
      <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827" }}>
        Customer Feedback
      </Typography>
    </Box>

    <Box sx={{ display: "flex", gap: 2, p: 2, alignItems: "stretch" }}>
      {/* Avg rating */}
      <Box
        sx={{
          width: 120,
          flexShrink: 0,
          bgcolor: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: 2,
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.4,
        }}
      >
        <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#b45309", lineHeight: 1 }}>
          {customerFeedback.avgRating != null
            ? customerFeedback.avgRating.toFixed(1)
            : "—"}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.2, mb: 0.3 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon
              key={s}
              sx={{
                fontSize: 13,
                color:
                  customerFeedback.avgRating != null &&
                  s <= Math.round(customerFeedback.avgRating)
                    ? "#f59e0b"
                    : "#e5e7eb",
              }}
            />
          ))}
        </Box>
        <Typography sx={{ fontSize: "0.68rem", color: "#92400e", textAlign: "center" }}>
          {customerFeedback.totalRatings}{" "}
          {customerFeedback.totalRatings === 1 ? "rating" : "ratings"}
        </Typography>
      </Box>

      {/* Star distribution */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.6 }}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count =
            customerFeedback.starDistribution[
              String(star) as "1" | "2" | "3" | "4" | "5"
            ] ?? 0;
          const pct =
            customerFeedback.totalRatings > 0
              ? (count / customerFeedback.totalRatings) * 100
              : 0;
          return (
            <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Typography sx={{ fontSize: "0.68rem", color: "#6b7280", width: 12, textAlign: "right" }}>
                {star}
              </Typography>
              <StarIcon sx={{ fontSize: 11, color: "#f59e0b" }} />
              <Box
                sx={{
                  flex: 1,
                  height: 6,
                  bgcolor: "#f3f4f6",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${pct}%`,
                    height: "100%",
                    bgcolor: "#f59e0b",
                    transition: "width 0.3s",
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: "0.68rem", color: "#6b7280", width: 22, textAlign: "right" }}>
                {count}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>

    {/* Reviews */}
    {customerFeedback.reviews.length > 0 && (
      <>
        <Divider />
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.2 }}>
          {customerFeedback.reviews.map((review, i) => (
            <Box
              key={`${review.customerName}-${review.date}-${i}`}
              sx={{
                border: "1px solid #f3f4f6",
                borderRadius: 2,
                p: 1.5,
                bgcolor: "#fafafa",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 0.7,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Avatar
                    sx={{
                      width: 26,
                      height: 26,
                      bgcolor: "#0D1B3E",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(review.customerName)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>
                      {review.customerName}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.1, mt: 0.2 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon
                          key={s}
                          sx={{ fontSize: 10, color: s <= review.stars ? "#f59e0b" : "#e5e7eb" }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: "0.65rem", color: "#9ca3af" }}>
                  {formatDate(review.date)}
                </Typography>
              </Box>

              {review.tags.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 0.6 }}>
                  {review.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        height: 18,
                        bgcolor: "#eff6ff",
                        color: "#21B057",
                        border: "1px solid #bfdbfe",
                        "& .MuiChip-label": { px: 0.7 },
                      }}
                    />
                  ))}
                </Box>
              )}

              {review.comment && (
                <Typography sx={{ fontSize: "0.75rem", color: "#374151", lineHeight: 1.45 }}>
                  {review.comment}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </>
    )}
  </Box>
);

export default RiderProfileCustomerFeedback;
