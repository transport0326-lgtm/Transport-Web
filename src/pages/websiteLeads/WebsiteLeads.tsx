import React, { useEffect, useMemo, useState } from "react";
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
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import BusinessIcon from "@mui/icons-material/Business";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import TablePagination from "../../components/common/TablePagination";
import WebsiteLeadDetailModal from "./WebsiteLeadDetailModal";
import type { RootState } from "../../redux/stores/store";
import { fetchQuoteRequests } from "../../redux/sagas/websiteLeads/quoteRequestsAction";
import { fetchBusinessQuotes } from "../../redux/sagas/websiteLeads/businessQuotesAction";
import { fetchContactMessages } from "../../redux/sagas/websiteLeads/contactMessagesAction";
import { fetchJobApplications } from "../../redux/sagas/websiteLeads/jobApplicationsAction";
import { fetchQuoteRequestById } from "../../redux/sagas/websiteLeads/fetchQuoteRequestByIdAction";
import { fetchBusinessQuoteById } from "../../redux/sagas/websiteLeads/fetchBusinessQuoteByIdAction";
import { fetchContactMessageById } from "../../redux/sagas/websiteLeads/fetchContactMessageByIdAction";
import { fetchJobApplicationById } from "../../redux/sagas/websiteLeads/fetchJobApplicationByIdAction";
import { clearLeadDetail } from "../../redux/slices/websiteLeadDetailSlice";

type TabKey = "leads" | "enterprise" | "contact" | "career";

const tabs: { key: TabKey; label: string }[] = [
  { key: "leads",      label: "Leads Form" },
  { key: "enterprise", label: "Enterprise Form" },
  { key: "contact",    label: "Contact Form" },
  { key: "career",    label: "Career Form" },
];

const formId = (row: { _id?: string }) =>
  row._id ? row._id.slice(-4).toUpperCase().padStart(4, "0") : "—";

const columnSets: Record<TabKey, string[]> = {
  leads:      ["Form ID", "Name", "Phone No", "City", "Reason", "Actions"],
  enterprise: ["Form ID", "Name", "Phone", "Email", "Company", "Actions"],
  contact:    ["Form ID", "Name", "Phone", "Subject", "Status", "Actions"],
  career:    ["Form ID", "Name", "Phone", "Position", "Status", "Actions"],
};

const viewBtnSx = {
  fontSize: "0.72rem",
  fontWeight: 600,
  textTransform: "none",
  color: "#E8490F",
  border: "1px solid #fed7aa",
  borderRadius: 1.5,
  px: 1.5,
  py: 0.3,
  minWidth: 0,
  gap: 0.5,
  "&:hover": { bgcolor: "#fff5f2", borderColor: "#E8490F" },
};

const statusChipSx = (status?: string) => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    pending:     { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    contacted:   { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    closed:      { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" },
    unread:      { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
    read:        { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    replied:     { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
    applied:     { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    reviewing:   { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    shortlisted: { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
    rejected:    { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
    hired:       { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
  };
  const st = map[status ?? ""] ?? { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
  return {
    fontSize: "0.7rem", fontWeight: 600, height: 22, borderRadius: 1,
    bgcolor: st.bg, color: st.color, border: `1px solid ${st.border}`,
    "& .MuiChip-label": { px: 1 },
  };
};

const WebsiteLeads: React.FC = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<TabKey>("leads");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<Record<TabKey, number>>({ leads: 1, enterprise: 1, contact: 1, career: 1 });
  const [limit, setLimit] = useState<Record<TabKey, number>>({ leads: 10, enterprise: 10, contact: 10, career: 10 });
  const [modalOpen, setModalOpen] = useState(false);

  const handleView = (row: any) => {
    if (!row._id) return;
    dispatch(clearLeadDetail());
    switch (activeTab) {
      case "leads":      dispatch(fetchQuoteRequestById({ id: row._id })); break;
      case "enterprise": dispatch(fetchBusinessQuoteById({ id: row._id })); break;
      case "contact":    dispatch(fetchContactMessageById({ id: row._id })); break;
      case "career":    dispatch(fetchJobApplicationById({ id: row._id })); break;
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    dispatch(clearLeadDetail());
  };

  const quoteRequests   = useSelector((s: RootState) => s.quoteRequests);
  const businessQuotes  = useSelector((s: RootState) => s.businessQuotes);
  const contactMessages = useSelector((s: RootState) => s.contactMessages);
  const jobApplications = useSelector((s: RootState) => s.jobApplications);

  useEffect(() => {
    dispatch(fetchQuoteRequests({ page: page.leads, limit: limit.leads }));
  }, [dispatch, page.leads, limit.leads]);

  useEffect(() => {
    dispatch(fetchBusinessQuotes({ page: page.enterprise, limit: limit.enterprise }));
  }, [dispatch, page.enterprise, limit.enterprise]);

  useEffect(() => {
    dispatch(fetchContactMessages({ page: page.contact, limit: limit.contact }));
  }, [dispatch, page.contact, limit.contact]);

  useEffect(() => {
    dispatch(fetchJobApplications({ page: page.career, limit: limit.career }));
  }, [dispatch, page.career, limit.career]);

  const counts = {
    leads:      quoteRequests.data?.total   ?? 0,
    enterprise: businessQuotes.data?.total  ?? 0,
    contact:    contactMessages.data?.total ?? 0,
    career:    jobApplications.data?.total ?? 0,
  };

  const statCards = [
    { count: counts.leads,      label: "Lead/Quote Form",        icon: <DescriptionIcon sx={{ fontSize: 22 }} />,    color: "#E8490F", lightColor: "#fff7ed" },
    { count: counts.enterprise, label: "Enterprise / B2B Inquiry", icon: <BusinessIcon sx={{ fontSize: 22 }} />,     color: "#dc2626", lightColor: "#fef2f2" },
    { count: counts.contact,    label: "Contact",                icon: <ContactMailIcon sx={{ fontSize: 22 }} />,    color: "#f59e0b", lightColor: "#fffbeb" },
    { count: counts.career,    label: "Careers Forms",         icon: <LocalShippingIcon sx={{ fontSize: 22 }} />,  color: "#6b7280", lightColor: "#f3f4f6" },
  ];

  const activeState =
    activeTab === "leads"      ? quoteRequests   :
    activeTab === "enterprise" ? businessQuotes  :
    activeTab === "contact"    ? contactMessages :
                                 jobApplications;

  const rows: any[] = useMemo(() => {
    if (activeTab === "leads")      return quoteRequests.data?.quotes ?? [];
    if (activeTab === "enterprise") return businessQuotes.data?.businessQuotes ?? [];
    if (activeTab === "contact")    return contactMessages.data?.contactMessages ?? [];
    return jobApplications.data?.jobApplications ?? [];
  }, [activeTab, quoteRequests.data, businessQuotes.data, contactMessages.data, jobApplications.data]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.name, r.fullName, r.phone, r.email, r.workEmail,
        r.city, r.currentCity, r.cities, r.companyName,
        r.serviceNeeded, r.position, r.department,
      ]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil((activeState.data?.total ?? 0) / limit[activeTab]));

  const headers = columnSets[activeTab];

  const setActivePage = (p: number) => setPage((prev) => ({ ...prev, [activeTab]: p }));
  const setActiveLimit = (l: number) => {
    setLimit((prev) => ({ ...prev, [activeTab]: l }));
    setPage((prev) => ({ ...prev, [activeTab]: 1 }));
  };

  const renderRowCells = (row: any) => {
    switch (activeTab) {
      case "leads":
        return (
          <>
            <TableCell sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827", py: 1.4, px: 2 }}>{formId(row)}</TableCell>
            <TableCell sx={{ fontSize: "0.82rem", color: "#111827", py: 1.4, px: 2 }}>{row.name ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.phone ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.city ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.serviceNeeded ?? "—"}</TableCell>
            <TableCell sx={{ py: 1.4, px: 2 }}>
              <Button size="small" sx={viewBtnSx} onClick={() => handleView(row)}>
                <VisibilityIcon sx={{ fontSize: 13 }} />
                View
              </Button>
            </TableCell>
          </>
        );
      case "enterprise":
        return (
          <>
            <TableCell sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827", py: 1.4, px: 2 }}>{formId(row)}</TableCell>
            <TableCell sx={{ fontSize: "0.82rem", color: "#111827", py: 1.4, px: 2 }}>{row.name ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.phone ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.workEmail ?? row.email ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.companyName ?? "—"}</TableCell>
            <TableCell sx={{ py: 1.4, px: 2 }}>
              <Button size="small" sx={viewBtnSx} onClick={() => handleView(row)}>
                <VisibilityIcon sx={{ fontSize: 13 }} />
                View
              </Button>
            </TableCell>
          </>
        );
      case "contact":
        return (
          <>
            <TableCell sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827", py: 1.4, px: 2 }}>{formId(row)}</TableCell>
            <TableCell sx={{ fontSize: "0.82rem", color: "#111827", py: 1.4, px: 2 }}>{row.name ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.phone ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.serviceNeeded ?? row.subject ?? "—"}</TableCell>
            <TableCell sx={{ py: 1.4, px: 2 }}>
              {row.status ? <Chip label={row.status} size="small" sx={statusChipSx(row.status)} /> : "—"}
            </TableCell>
            <TableCell sx={{ py: 1.4, px: 2 }}>
              <Button size="small" sx={viewBtnSx} onClick={() => handleView(row)}>
                <VisibilityIcon sx={{ fontSize: 13 }} />
                View
              </Button>
            </TableCell>
          </>
        );
      case "career":
        return (
          <>
            <TableCell sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827", py: 1.4, px: 2 }}>{formId(row)}</TableCell>
            <TableCell sx={{ fontSize: "0.82rem", color: "#111827", py: 1.4, px: 2 }}>{row.fullName ?? row.name ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.phone ?? "—"}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.position ?? "—"}</TableCell>
            <TableCell sx={{ py: 1.4, px: 2 }}>
              {row.status ? <Chip label={row.status} size="small" sx={statusChipSx(row.status)} /> : "—"}
            </TableCell>
            <TableCell sx={{ py: 1.4, px: 2 }}>
              <Button size="small" sx={viewBtnSx} onClick={() => handleView(row)}>
                <VisibilityIcon sx={{ fontSize: 13 }} />
                View
              </Button>
            </TableCell>
          </>
        );
    }
  };

  return (
    <AdminLayout pageTitle="Website Leads">
      {/* Stat Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {statCards.map((card) => (
          <Box
            key={card.label}
            sx={{
              flex: 1, bgcolor: "#fff", border: "1px solid #e5e7eb",
              borderLeft: `4px solid ${card.color}`, borderRadius: 2, p: 2,
              display: "flex", alignItems: "center", gap: 1.8,
            }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: card.lightColor, color: card.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {card.icon}
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.7rem", fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>{card.count}</Typography>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{card.label}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Tab strip + Search */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", gap: 0, border: "1px solid #e5e7eb", borderRadius: 2, overflow: "hidden", bgcolor: "#fff" }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = counts[tab.key];
            return (
              <Button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                disableElevation
                sx={{
                  px: 2.5, py: 1, fontSize: "0.82rem", fontWeight: isActive ? 700 : 500,
                  textTransform: "none", borderRadius: 0,
                  bgcolor: isActive ? "#0D1B3E" : "transparent",
                  color: isActive ? "#fff" : "#6b7280",
                  borderRight: "1px solid #e5e7eb",
                  "&:last-child": { borderRight: "none" },
                  "&:hover": { bgcolor: isActive ? "#162b5e" : "#f9fafb" },
                }}
              >
                {tab.label}
                {count > 0 && (
                  <Box component="span" sx={{ ml: 0.8, px: 0.7, py: 0.1, fontSize: "0.7rem", fontWeight: 700, borderRadius: 10, bgcolor: isActive ? "rgba(255,255,255,0.2)" : "#f3f4f6", color: isActive ? "#fff" : "#6b7280" }}>
                    {count}
                  </Box>
                )}
              </Button>
            );
          })}
        </Box>

        <OutlinedInput
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={<InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} /></InputAdornment>}
          sx={{ fontSize: "0.82rem", borderRadius: 2, height: 36, minWidth: 220, "& fieldset": { borderColor: "#e5e7eb" }, "& input": { py: 0.5 } }}
        />
      </Box>

      {/* Table */}
      <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: 2, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              {headers.map((col) => (
                <TableCell key={col} sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", letterSpacing: 0.4, borderBottom: "1px solid #f3f4f6", py: 1.2, px: 2, whiteSpace: "nowrap" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activeState.loading ? (
              <TableRow><TableCell colSpan={headers.length} sx={{ textAlign: "center", py: 4, color: "#9ca3af", fontSize: "0.85rem" }}>Loading...</TableCell></TableRow>
            ) : activeState.error ? (
              <TableRow><TableCell colSpan={headers.length} sx={{ textAlign: "center", py: 4, color: "#dc2626", fontSize: "0.85rem" }}>Failed to load: {activeState.error}</TableCell></TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow><TableCell colSpan={headers.length} sx={{ textAlign: "center", py: 4, color: "#9ca3af", fontSize: "0.85rem" }}>No entries found</TableCell></TableRow>
            ) : (
              filteredRows.map((row) => (
                <TableRow key={row._id} sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: "#fafafa" } }}>
                  {renderRowCells(row)}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <Box sx={{ px: 2, py: 1.2, borderTop: "1px solid #f3f4f6" }}>
          <TablePagination
            page={page[activeTab]}
            totalPages={totalPages}
            limit={limit[activeTab]}
            onPageChange={setActivePage}
            onLimitChange={setActiveLimit}
          />
        </Box>
      </Box>

      <WebsiteLeadDetailModal
        open={modalOpen}
        onClose={handleModalClose}
        tab={activeTab}
      />
    </AdminLayout>
  );
};

export default WebsiteLeads;
