import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Chip,
  Button,
  Dialog,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import { updateRiderDocument } from "../../redux/sagas/riderManagement/riderDocumentAction";
import type { DocItem } from "./RiderProfileHelpers";

interface DocSectionProps {
  doc: DocItem;
  riderId: string;
}

const DocSection: React.FC<DocSectionProps> = ({ doc, riderId }) => {
  const dispatch = useDispatch();
  const isApproved = doc.status === "approved";
  const isRejected = doc.status === "rejected";
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleApprove = () => {
    dispatch(
      updateRiderDocument({ riderId, docType: doc.key, status: "approved" }),
    );
  };

  const handleReject = () => {
    dispatch(
      updateRiderDocument({ riderId, docType: doc.key, status: "rejected" }),
    );
  };

  const containerBg = isApproved ? "#E8F8EE" : isRejected ? "#FEF2F2" : "#fff";

  const statusChip = isApproved
    ? {
        icon: <CheckCircleIcon sx={{ fontSize: "13px !important" }} />,
        label: "Approved",
        bgcolor: "#f0fdf4",
        color: "#16a34a",
        border: "#bbf7d0",
      }
    : isRejected
      ? {
          icon: <CloseIcon sx={{ fontSize: "13px !important" }} />,
          label: "Rejected",
          bgcolor: "#fef2f2",
          color: "#dc2626",
          border: "#fecaca",
        }
      : {
          icon: <WarningAmberIcon sx={{ fontSize: "13px !important" }} />,
          label: "Pending",
          bgcolor: "#fffbeb",
          color: "#d97706",
          border: "#fde68a",
        };

  const previewBg = isApproved
    ? "rgba(255,255,255,0.55)"
    : isRejected
      ? "rgba(62, 42, 42, 0.5)"
      : "#eef3f8";
  const previewBorder = isApproved
    ? "rgba(255,255,255,0.6)"
    : isRejected
      ? "#fca5a5"
      : "#dde8f0";

  return (
    <Box sx={{ p: 2.5, bgcolor: containerBg }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.7,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InsertDriveFileIcon sx={{ fontSize: 17, color: "#6b7280" }} />
          <Typography
            sx={{ fontSize: "0.86rem", fontWeight: 600, color: "#111827" }}
          >
            {doc.type}
          </Typography>
          <Chip
            label={doc.required ? "Required" : "Optional"}
            size="small"
            sx={{
              fontSize: "0.6rem",
              fontWeight: 700,
              height: 18,
              bgcolor: doc.required ? "#fff7ed" : "#f3f4f6",
              color: doc.required ? "#ea580c" : "#6b7280",
              border: `1px solid ${doc.required ? "#fed7aa" : "#e5e7eb"}`,
              "& .MuiChip-label": { px: 0.7 },
            }}
          />
        </Box>
        <Chip
          icon={statusChip.icon}
          label={statusChip.label}
          size="small"
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            height: 22,
            bgcolor: statusChip.bgcolor,
            color: statusChip.color,
            border: `1px solid ${statusChip.border}`,
            "& .MuiChip-label": { pl: 0.3 },
            "& .MuiChip-icon": { color: "inherit", ml: 0.5 },
          }}
        />
      </Box>

      <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 1.4 }}>
        {doc.number}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box sx={{ flexShrink: 0 }}>
          <Box
            sx={{
              width: 130,
              height: 82,
              bgcolor: previewBg,
              border: `1px solid ${previewBorder}`,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              mb: 0.5,
            }}
          >
            {doc.url ? (
              <img
                src={doc.url}
                alt={doc.type}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <ImageIcon sx={{ fontSize: 30, color: "#93c5fd" }} />
            )}
          </Box>
          {doc.url && (
            <Button
              size="small"
              onClick={() => setPreviewOpen(true)}
              sx={{
                fontSize: "0.7rem",
                fontWeight: 500,
                textTransform: "none",
                color: "#3b82f6",
                p: 0,
                minWidth: 0,
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              View Full
            </Button>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
            minHeight: 95,
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
              Submitted {doc.submitted}
            </Typography>
          </Box>

          {isApproved ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 13, color: "#16a34a" }} />
              <Typography
                sx={{ fontSize: "0.72rem", color: "#16a34a", fontWeight: 500 }}
              >
                Approved by Admin
              </Typography>
            </Box>
          ) : isRejected ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 0.7,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CloseIcon sx={{ fontSize: 13, color: "#dc2626" }} />
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: "#dc2626",
                    fontWeight: 500,
                  }}
                >
                  Rejected by Admin
                </Typography>
              </Box>
              <Button
                size="small"
                startIcon={<CheckIcon sx={{ fontSize: "11px !important" }} />}
                onClick={handleApprove}
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#16a34a",
                  border: "1px solid #86efac",
                  borderRadius: 1.5,
                  px: 1.2,
                  py: 0.4,
                  minWidth: 0,
                  "&:hover": { bgcolor: "#f0fdf4" },
                }}
              >
                Approve
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 0.7 }}>
              <Button
                size="small"
                startIcon={<CloseIcon sx={{ fontSize: "11px !important" }} />}
                onClick={handleReject}
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#dc2626",
                  border: "1px solid #fca5a5",
                  borderRadius: 1.5,
                  px: 1.2,
                  py: 0.4,
                  minWidth: 0,
                  "&:hover": { bgcolor: "#fef2f2" },
                }}
              >
                Reject
              </Button>
              <Button
                size="small"
                startIcon={<CheckIcon sx={{ fontSize: "11px !important" }} />}
                onClick={handleApprove}
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#16a34a",
                  border: "1px solid #86efac",
                  borderRadius: 1.5,
                  px: 1.2,
                  py: 0.4,
                  minWidth: 0,
                  "&:hover": { bgcolor: "#f0fdf4" },
                }}
              >
                Approve
              </Button>
            </Box>
          )}
        </Box>
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth={false}
          sx={{
            "& .MuiDialog-paper": {
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "visible",
              m: 2,
            },
            "& .MuiBackdrop-root": { bgcolor: "rgba(0,0,0,0.85)" },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setPreviewOpen(false)}
              sx={{
                position: "absolute",
                top: -14,
                right: -14,
                zIndex: 1,
                bgcolor: "#fff",
                width: 30,
                height: 30,
                "&:hover": { bgcolor: "#f3f4f6" },
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Box
              component="img"
              src={doc.url!}
              alt={doc.type}
              sx={{
                display: "block",
                maxWidth: "90vw",
                maxHeight: "85vh",
                borderRadius: 2,
                objectFit: "contain",
              }}
            />
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DocSection;
