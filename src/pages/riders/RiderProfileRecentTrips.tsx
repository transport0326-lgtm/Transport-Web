import React from "react";
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import TablePagination from "../../components/common/TablePagination";
import { formatDate } from "./RiderProfileHelpers";
import type { RiderDetailTrip } from "../../redux/slices/riderDetailSlice";

interface RiderProfileRecentTripsProps {
  recentTrips: RiderDetailTrip[];
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const RiderProfileRecentTrips: React.FC<RiderProfileRecentTripsProps> = ({
  recentTrips,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const totalPages = Math.ceil(recentTrips.length / limit);
  const pagedTrips = recentTrips.slice(page * limit, (page + 1) * limit);

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.8,
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HistoryIcon sx={{ fontSize: 18, color: "#6b7280" }} />
          <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827" }}>
            Recent Trips
          </Typography>
        </Box>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f9fafb" }}>
            {["TRIP #", "CUSTOMER", "ROUTE", "DATE", "AMOUNT", "STATUS"].map((col) => (
              <TableCell
                key={col}
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "#9ca3af",
                  letterSpacing: 0.5,
                  borderBottom: "1px solid #f3f4f6",
                  py: 1.2,
                  px: 2.5,
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {recentTrips.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                sx={{ textAlign: "center", py: 4, color: "#9ca3af", fontSize: "0.85rem" }}
              >
                No trips yet
              </TableCell>
            </TableRow>
          ) : (
            pagedTrips.map((trip) => {
              const isCompleted = trip.status === "completed";
              const route = `${trip.pickup} → ${trip.dropoff}`;
              const shortRoute = route.length > 55 ? route.slice(0, 52) + "…" : route;
              return (
                <TableRow
                  key={trip.bookingNumber}
                  sx={{
                    "&:last-child td": { border: 0 },
                    "&:hover": { bgcolor: "#fafafa" },
                  }}
                >
                  <TableCell sx={{ py: 1.4, px: 2.5, fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
                    {trip.bookingNumber}
                  </TableCell>
                  <TableCell sx={{ py: 1.4, px: 2.5, fontSize: "0.82rem", color: "#374151" }}>
                    {trip.customerName}
                  </TableCell>
                  <TableCell sx={{ py: 1.4, px: 2.5, fontSize: "0.78rem", color: "#6b7280", maxWidth: 220 }}>
                    {shortRoute}
                  </TableCell>
                  <TableCell sx={{ py: 1.4, px: 2.5, fontSize: "0.78rem", color: "#6b7280", whiteSpace: "nowrap" }}>
                    {formatDate(trip.date)}
                  </TableCell>
                  <TableCell sx={{ py: 1.4, px: 2.5, fontSize: "0.84rem", fontWeight: 600, color: "#111827" }}>
                    ₹{trip.amount}
                  </TableCell>
                  <TableCell sx={{ py: 1.4, px: 2.5 }}>
                    <Chip
                      label={isCompleted ? "Completed" : "Cancelled"}
                      size="small"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        height: 22,
                        bgcolor: isCompleted ? "#f0fdf4" : "#fef2f2",
                        color: isCompleted ? "#16a34a" : "#dc2626",
                        border: `1px solid ${isCompleted ? "#bbf7d0" : "#fecaca"}`,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {recentTrips.length > 0 && (
        <Box sx={{ px: 2.5, py: 1.5, borderTop: "1px solid #f3f4f6" }}>
          <TablePagination
            page={page + 1}
            totalPages={totalPages}
            limit={limit}
            onPageChange={(p) => onPageChange(p - 1)}
            onLimitChange={onLimitChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default RiderProfileRecentTrips;
