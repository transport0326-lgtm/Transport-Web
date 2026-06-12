import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TablePagination from "../../components/common/TablePagination";
import { formatCurrency } from "../../utils/format";
import type { TopRider } from "../../redux/slices/reportsSlice";

interface ReportsTopRidersTableProps {
  loading: boolean;
  allTopRiders: TopRider[];
  pagedRiders: TopRider[];
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const ReportsTopRidersTable: React.FC<ReportsTopRidersTableProps> = ({
  loading,
  allTopRiders,
  pagedRiders,
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}) => (
  <Card elevation={0} sx={{ border: "1px solid #eee", borderRadius: 2 }}>
    <CardContent sx={{ p: 2.5 }}>
      <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", mb: 2 }}>
        Top Performing Partners
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#fafafa" }}>
            {["#", "Partner", "Vehicle No.", "Deliveries", "Revenue", "Avg Time", "Status"].map((col) => (
              <TableCell
                key={col}
                sx={{
                  color: "#aaa",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  borderBottom: "1px solid #f0f0f0",
                  py: 1.1,
                  px: 2,
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((__, j) => (
                  <TableCell key={j} sx={{ py: 1.4, px: 2 }}>
                    <Skeleton height={20} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : allTopRiders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                sx={{
                  textAlign: "center",
                  color: "#aaa",
                  py: 3,
                  fontSize: "0.82rem",
                }}
              >
                No partners data available
              </TableCell>
            </TableRow>
          ) : (
            pagedRiders.map((row) => (
              <TableRow
                key={row.riderId}
                sx={{
                  "&:last-child td": { border: 0 },
                  "&:hover": { bgcolor: "#fafafa" },
                }}
              >
                <TableCell sx={{ fontSize: "0.82rem", color: "#aaa", py: 1.4, px: 2 }}>
                  {row.rank}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a1a2e", py: 1.4, px: 2 }}>
                  {row.name}
                </TableCell>
                <TableCell sx={{ fontSize: "0.82rem", color: "#555", py: 1.4, px: 2 }}>
                  {row.vehicleNumber}
                </TableCell>
                <TableCell sx={{ fontSize: "0.82rem", color: "#555", py: 1.4, px: 2 }}>
                  {row.deliveries}
                </TableCell>
                <TableCell sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#444", py: 1.4, px: 2 }}>
                  {formatCurrency(row.revenue)}
                </TableCell>
                <TableCell sx={{ fontSize: "0.82rem", color: "#555", py: 1.4, px: 2 }}>
                  {row.avgDeliveryMin} min
                </TableCell>
                <TableCell sx={{ py: 1.4, px: 2 }}>
                  <Chip
                    label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    size="small"
                    sx={{
                      bgcolor: row.status === "active" ? "#e8f5e9" : "#f5f5f5",
                      color: row.status === "active" ? "#2e7d32" : "#757575",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      height: 22,
                      borderRadius: 1,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Box sx={{ pt: 1.5, borderTop: "1px solid #f0f0f0" }}>
        <TablePagination
          page={page + 1}
          totalPages={totalPages}
          limit={limit}
          onPageChange={(p) => onPageChange(p - 1)}
          onLimitChange={onLimitChange}
        />
      </Box>
    </CardContent>
  </Card>
);

export default ReportsTopRidersTable;
