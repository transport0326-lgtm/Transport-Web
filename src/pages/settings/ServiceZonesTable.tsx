import React from "react";
import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { deleteServiceZone } from "../../redux/sagas/serviceZones/createServiceZoneAction";
import type { Zone } from "./ServiceZonesHelpers";

interface ServiceZonesTableProps {
  zones: Zone[];
  onEdit: (zone: Zone) => void;
}

const ServiceZonesTable: React.FC<ServiceZonesTableProps> = ({ zones, onEdit }) => {
  const dispatch = useDispatch();

  return (
    <Box sx={{ border: "1px solid #f0f0f0", borderRadius: 2, overflow: "hidden", mb: 3.5 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#fafafa" }}>
            {[
              "Zone Name",
              "Area Coverage",
              "Active Partners",
              "Total Partners",
              "Status",
              "Action",
            ].map((col) => (
              <TableCell
                key={col}
                sx={{
                  fontSize: "0.75rem",
                  color: "#aaa",
                  fontWeight: 500,
                  py: 1.2,
                  px: 2,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {zones.map((row) => (
            <TableRow
              key={row._id}
              sx={{
                "&:last-child td": { border: 0 },
                "&:hover": { bgcolor: "#fafafa" },
              }}
            >
              <TableCell
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1a1a2e",
                  py: 1.4,
                  px: 2,
                }}
              >
                {row.name}
                <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                  {row.city}, {row.state}
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: "0.85rem", color: "#555", py: 1.4, px: 2 }}>
                {row.areaCoverage ? `${row.areaCoverage} km²` : "—"}
              </TableCell>
              <TableCell sx={{ fontSize: "0.85rem", color: "#555", py: 1.4, px: 2 }}>
                {row.activeRiders}
              </TableCell>
              <TableCell sx={{ fontSize: "0.85rem", color: "#555", py: 1.4, px: 2 }}>
                {row.totalRiders}
              </TableCell>
              <TableCell sx={{ py: 1.4, px: 2 }}>
                <Chip
                  label={row.isActive ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    height: 22,
                    borderRadius: 1,
                    bgcolor: row.isActive ? "#e8f5e9" : "#fff3e0",
                    color: row.isActive ? "#2e7d32" : "#e65100",
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: 1.4, px: 2 }}>
                <Box sx={{ display: "flex", gap: 0.8 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onEdit(row)}
                    sx={{
                      borderColor: "#ddd",
                      color: "#E8490F",
                      fontSize: "0.72rem",
                      textTransform: "none",
                      borderRadius: 1.5,
                      px: 1.8,
                      py: 0.3,
                      minWidth: 0,
                      "&:hover": {
                        borderColor: "#E8490F",
                        bgcolor: "#fff5f2",
                      },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    disableElevation
                    startIcon={<DeleteIcon sx={{ fontSize: "13px !important" }} />}
                    onClick={() => dispatch(deleteServiceZone({ zoneId: row._id }))}
                    sx={{
                      bgcolor: "#dc2626",
                      color: "#fff",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 1.5,
                      px: 1.5,
                      py: 0.3,
                      minWidth: 0,
                      "&:hover": { bgcolor: "#b91c1c" },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ServiceZonesTable;
