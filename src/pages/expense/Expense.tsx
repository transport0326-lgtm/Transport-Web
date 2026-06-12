import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteOutlined as DeleteOutlinedIcon } from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AlarmIcon from "@mui/icons-material/Alarm";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BuildIcon from "@mui/icons-material/Build";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AdminLayout from "../../components/layout/AdminLayout";
import BillingFormModal from "../../components/modals/BillingFormModal";
import type { BillingFormData } from "../../components/modals/BillingFormModal";
import BillingDeleteModal from "../../components/modals/BillingDeleteModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../redux/stores/store";
import type { RootState } from "../../redux/stores/store";
import type { BillingRecord } from "../../redux/slices/billingSlice";
import { addBilling } from "../../redux/sagas/billings/addBillingAction";
import { updateBilling } from "../../redux/sagas/billings/updateBillingAction";
import { deleteBilling } from "../../redux/sagas/billings/deleteBillingAction";
import { fetchBilling } from "../../redux/sagas/billings/fetchBillingAction";
import { exportBillingExcel } from "../../redux/sagas/billings/exportBillingExcelAction";

type Category =
  | "Domain"
  | "Hosting"
  | "Security"
  | "API Service"
  | "Email"
  | "Storage"
  | "Payments";

type Status = "Active" | "Due Soon" | "Expired";

const categoryStyle: Record<Category, { bg: string; color: string }> = {
  Domain:        { bg: "rgba(61,133,245,0.1)",  color: "#3d85f5" },
  Hosting:       { bg: "rgba(247,85,34,0.1)",   color: "#f75522" },
  Security:      { bg: "rgba(33,196,94,0.1)",   color: "#21c45e" },
  "API Service": { bg: "rgba(61,133,245,0.1)",  color: "#3d85f5" },
  Email:         { bg: "rgba(115,115,120,0.1)", color: "#737378" },
  Storage:       { bg: "rgba(242,156,18,0.1)",  color: "#f29c12" },
  Payments:      { bg: "rgba(61,133,245,0.1)",  color: "#3d85f5" },
};

const statusStyle: Record<Status, { bg: string; border: string; color: string }> = {
  Active:     { bg: "rgba(33,196,94,0.1)",  border: "rgba(33,196,94,0.3)",  color: "#21c45e" },
  "Due Soon": { bg: "rgba(242,156,18,0.1)", border: "rgba(242,156,18,0.3)", color: "#f29c12" },
  Expired:    { bg: "rgba(237,51,51,0.1)",  border: "rgba(237,51,51,0.3)",  color: "#ed3333" },
};

const daysLeftStyle = (status: string) => {
  if (status === "Expired") return { bg: "rgba(237,51,51,0.1)",  color: "#ed3333" };
  if (status === "Due Soon") return { bg: "rgba(242,156,18,0.1)", color: "#f29c12" };
  return { bg: "rgba(115,115,120,0.1)", color: "#737378" };
};

const Expense: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.billing);

  const records: BillingRecord[] = data?.records ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<BillingRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const totalPaid = records.reduce((sum, r) => sum + r.amount, 0);
  const dueSoon = records.filter((r) => r.status === "Due Soon" || r.status === "Expired");
  const activeCount = records.filter((r) => r.status === "Active").length;
  const nextRenewalRecord = [...records]
    .filter((r) => r.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  const formatDisplayDate = (isoStr: string) => {
    if (!isoStr) return "—";
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "—";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const statCards = [
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 22 }} />,
      value: `₹${totalPaid.toLocaleString("en-IN")}`,
      label: "Total Paid (This Year)",
      sub: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
          <TrendingUpIcon sx={{ fontSize: 12, color: "#21c45e" }} />
          <span style={{ color: "#21c45e", fontSize: "0.68rem", fontWeight: 600 }}>
            18% vs last year
          </span>
        </Box>
      ),
      color: "#21c45e",
      lightColor: "#f0fdf4",
    },
    {
      icon: <AlarmIcon sx={{ fontSize: 22 }} />,
      value: `₹${dueSoon.reduce((s, r) => s + r.amount, 0).toLocaleString("en-IN")}`,
      label: "Due This Month",
      sub: (
        <Typography sx={{ fontSize: "0.68rem", color: "#f29c12" }}>
          {dueSoon.length} services expiring
        </Typography>
      ),
      color: "#f29c12",
      lightColor: "#fffbeb",
    },
    {
      icon: <CalendarTodayIcon sx={{ fontSize: 22 }} />,
      value: nextRenewalRecord ? `${nextRenewalRecord.daysLeft} Days` : "—",
      label: "Next Renewal",
      sub: (
        <Typography sx={{ fontSize: "0.68rem", color: "#3d85f5", fontWeight: 600 }}>
          {nextRenewalRecord?.serviceName ?? "—"}
        </Typography>
      ),
      color: "#3d85f5",
      lightColor: "#eff6ff",
    },
    {
      icon: <BuildIcon sx={{ fontSize: 22 }} />,
      value: activeCount.toString(),
      label: "Active Services",
      sub: (
        <Typography sx={{ fontSize: "0.68rem", color: "#21c45e" }}>
          All systems running
        </Typography>
      ),
      color: "#21c45e",
      lightColor: "#f0fdf4",
    },
  ];

  const openAdd = () => {
    setEditRecord(null);
    setDialogOpen(true);
  };

  const openEdit = (rec: BillingRecord) => {
    setEditRecord(rec);
    setDialogOpen(true);
  };

  const handleSave = (formData: BillingFormData) => {
    if (editRecord !== null) {
      dispatch(updateBilling({ id: editRecord._id, ...formData }));
    } else {
      dispatch(addBilling({ ...formData, paidVia: "Bank Transfer" }));
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteBilling({ id }));
    setDeleteConfirmId(null);
  };

  const handleExport = () => {
    dispatch(exportBillingExcel());
  };

  useEffect(() => {
    dispatch(fetchBilling());
  }, [dispatch]);

  return (
    <AdminLayout pageTitle="Billing & Payments">
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, color: "#26262b", lineHeight: 1.3 }}>
          Billing &amp; Payments
        </Typography>
        <Typography sx={{ fontSize: "0.78rem", color: "#737378", mt: 0.3 }}>
          Settings&nbsp;/&nbsp;
          <span style={{ color: "#26262b" }}>Billing &amp; Payments</span>
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {statCards.map((card) => (
          <Box
            key={card.label}
            sx={{ flex: 1, bgcolor: "#fff", border: "1px solid #e0e3e5", borderRadius: 2, p: 2, display: "flex", alignItems: "center", gap: 1.8 }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: card.lightColor, color: card.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {card.icon}
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.55rem", fontWeight: 800, color: "#26262b", lineHeight: 1.1 }}>
                {card.value}
              </Typography>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 400, color: "#737378" }}>
                {card.label}
              </Typography>
              <Box sx={{ mt: 0.2 }}>{card.sub}</Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Table Card */}
      <Box sx={{ bgcolor: "#fff", border: "1px solid #e0e3e5", borderRadius: 2, overflow: "hidden" }}>
        {/* Table Toolbar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 1.8, borderBottom: "1px solid #e0e3e5" }}>
          <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#26262b" }}>
            Payment Records
          </Typography>
          <Button
            variant="contained" disableElevation
            onClick={openAdd}
            sx={{ bgcolor: "#f75522", color: "#fff", textTransform: "none", fontWeight: 600, fontSize: "0.82rem", borderRadius: "10px", px: 2.5, py: 0.9, "&:hover": { bgcolor: "#d94319" } }}
          >
            + Add Payment
          </Button>
        </Box>

        {/* Scrollable Table */}
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f7fafc" }}>
                {["SERVICE", "CATEGORY", "AMOUNT", "PAID ON", "NEXT RENEWAL", "STATUS", "ACTIONS"].map((col) => (
                  <TableCell key={col} sx={{ fontSize: "0.68rem", fontWeight: 600, color: "#737378", letterSpacing: 0.5, borderBottom: "1px solid #e0e3e5", py: 1.2, px: 2, whiteSpace: "nowrap" }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4, color: "#737378", fontSize: "0.85rem" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4, color: "#737378", fontSize: "0.85rem" }}>
                    No payment records found
                  </TableCell>
                </TableRow>
              ) : (
                records.map((row, idx) => {
                  const cStyle = categoryStyle[row.category as Category] ?? { bg: "rgba(115,115,120,0.1)", color: "#737378" };
                  const sStyle = statusStyle[row.status as Status] ?? statusStyle["Active"];
                  const dlStyle = daysLeftStyle(row.status);
                  const isAlt = idx % 2 === 0;
                  return (
                    <TableRow
                      key={row._id}
                      sx={{ bgcolor: isAlt ? "#fbfcfd" : "#fff", "&:last-child td": { border: 0 }, "&:hover": { bgcolor: "#f5f7fa" }, borderTop: "1px solid #e0e3e5" }}
                    >
                      {/* SERVICE */}
                      <TableCell sx={{ py: 2, px: 2, minWidth: 180, maxWidth: 220 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                          <Typography sx={{ fontSize: "0.9rem", flexShrink: 0, mt: "1px" }}>🔧</Typography>
                          <Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: "#26262b", whiteSpace: "normal", wordBreak: "break-word", lineHeight: 1.4 }}>
                            {row.serviceName}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* CATEGORY */}
                      <TableCell sx={{ py: 2, px: 2, minWidth: 100 }}>
                        <Chip
                          label={row.category}
                          size="small"
                          sx={{ fontSize: "0.7rem", fontWeight: 500, height: 22, bgcolor: cStyle.bg, color: cStyle.color, border: "none", borderRadius: "6px", "& .MuiChip-label": { px: 1 } }}
                        />
                      </TableCell>

                      {/* AMOUNT */}
                      <TableCell sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#26262b", py: 2, px: 2, whiteSpace: "nowrap", minWidth: 90 }}>
                        ₹{row.amount.toLocaleString("en-IN")}
                      </TableCell>

                      {/* PAID ON */}
                      <TableCell sx={{ fontSize: "0.82rem", color: "#737378", py: 2, px: 2, whiteSpace: "nowrap", minWidth: 110 }}>
                        {formatDisplayDate(row.paidOn)}
                      </TableCell>

                      {/* NEXT RENEWAL */}
                      <TableCell sx={{ py: 2, px: 2, minWidth: 130 }}>
                        <Typography sx={{ fontSize: "0.82rem", color: "#26262b", fontWeight: 500, whiteSpace: "nowrap" }}>
                          {formatDisplayDate(row.nextRenewal)}
                        </Typography>
                        <Box
                          sx={{ display: "inline-flex", alignItems: "center", bgcolor: dlStyle.bg, borderRadius: "5px", px: 0.8, py: 0.3, mt: 0.4 }}
                        >
                          <Typography sx={{ fontSize: "0.68rem", fontWeight: 500, color: dlStyle.color, lineHeight: 1 }}>
                            {row.daysLeft > 0
                              ? `${row.daysLeft}d left`
                              : `${Math.abs(row.daysLeft)}d ago`}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* STATUS */}
                      <TableCell sx={{ py: 2, px: 2, minWidth: 100 }}>
                        <Box
                          sx={{ display: "inline-flex", alignItems: "center", bgcolor: sStyle.bg, border: `1px solid ${sStyle.border}`, borderRadius: "7px", px: 1.2, py: 0.5 }}
                        >
                          <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: sStyle.color }}>
                            {row.status}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell sx={{ py: 2, px: 2, minWidth: 100 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon sx={{ fontSize: "12px !important" }} />}
                            onClick={() => openEdit(row)}
                            sx={{ fontSize: "0.72rem", fontWeight: 500, textTransform: "none", color: "#737378", border: "1px solid #e0e3e5", borderRadius: "7px", px: 1, py: 0.4, minWidth: 0, "&:hover": { bgcolor: "#f7fafc" } }}
                          >
                            Edit
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => setDeleteConfirmId(row._id)}
                            sx={{ width: 26, height: 26, borderRadius: "7px", border: "1px solid rgba(237,51,51,0.3)", color: "#ed3333", bgcolor: "#fff", "&:hover": { bgcolor: "#fff5f5" } }}
                          >
                            <DeleteOutlinedIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 1.3, borderTop: "1px solid #e0e3e5" }}>
          <Typography sx={{ fontSize: "0.78rem", color: "#737378" }}>
            Showing {records.length} of {data?.total ?? 0} payment records
          </Typography>
          <Button
            size="small"
            startIcon={<FileDownloadIcon sx={{ fontSize: 15 }} />}
            onClick={handleExport}
            sx={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "none", color: "#737378", border: "1px solid #e0e3e5", borderRadius: "7px", px: 1.5, py: 0.5, bgcolor: "#fff", "&:hover": { bgcolor: "#f7fafc" } }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      <BillingFormModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editRecord={editRecord}
        onSave={handleSave}
      />
      <BillingDeleteModal
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => { if (deleteConfirmId) handleDelete(deleteConfirmId); }}
      />
    </AdminLayout>
  );
};

export default Expense;
