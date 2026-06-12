import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  Avatar,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import GroupIcon from "@mui/icons-material/Group";
import AdminLayout from "../../components/layout/AdminLayout";
import TablePagination from "../../components/common/TablePagination";
import { getAvatarColor, getInitials } from "../../utils/avatar";
import { capitalizeVehicle } from "../../utils/vehicle";
import { isAuthenticated } from "../../utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetchRiderManagement } from "../../redux/sagas/riderManagement/riderManagementAction";
import type { RootState } from "../../redux/stores/store";
import type { Rider } from "../../redux/slices/riderManagementSlice";
import {
  resetApprove,
  resetReject,
  resetSuspend,
} from "../../redux/slices/riderManagementSlice";
import { fetchZoneSettings } from "../../redux/sagas/serviceZones/zoneSettingsAction";

type TabType = "pending" | "approved" | "rejected" | "suspended";

const vehicleStyle: Record<string, { bg: string; color: string }> = {
  Bike:       { bg: "#dbeafe", color: "#1d4ed8" },
  Auto:       { bg: "#dcfce7", color: "#15803d" },
  "Mini Truck": { bg: "#f3e8ff", color: "#7e22ce" },
  Truck:      { bg: "#ffedd5", color: "#c2410c" },
};

const DocBadge = ({ label, verified }: { label: string; verified: boolean }) => (
  <Chip
    label={verified ? label : `${label} ✕`}
    size="small"
    sx={{
      fontSize: "0.62rem", fontWeight: 700, height: 20, px: 0.2,
      bgcolor: verified ? "#dcfce7" : "#fee2e2",
      color: verified ? "#15803d" : "#b91c1c",
      border: `1px solid ${verified ? "#bbf7d0" : "#fecaca"}`,
      borderRadius: 1,
      "& .MuiChip-label": { px: 0.8 },
    }}
  />
);

const tabs: { key: TabType; label: string }[] = [
  { key: "pending",   label: "Pending Approval" },
  { key: "approved",  label: "Approved" },
  { key: "rejected",  label: "Rejected" },
  { key: "suspended", label: "Suspended" },
];

const tableHeaders = [
  "RIDER", "PHONE", "VEHICLE", "ZONE", "SUBMITTED",
  "DOCUMENTS", "STATUS", "TRIPS", "RATING", " ACCOUNT STATUS",
];

const selectSx = {
  fontSize: "0.82rem",
  borderRadius: 2,
  height: 36,
  "& fieldset": { borderColor: "#e5e7eb" },
  bgcolor: "#fff",
};

const RiderManagement: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab]       = useState<TabType>("pending");
  const [search, setSearch]             = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [zoneFilter, setZoneFilter]     = useState("all");
  const [docFilter, setDocFilter]       = useState("all");
  const [page, setPage]                 = useState(1);
  const [limit, setLimit]               = useState(10);

  const { data, loading, error, approveSuccess, rejectSuccess, suspendSuccess } =
    useSelector((state: RootState) => state.riderManagement);
  const { data: zoneData } = useSelector((state: RootState) => state.zoneSettings);

  const riders: Rider[] = Array.isArray(data?.riders) ? data.riders : [];
  const stats = data?.stats ?? { pending: 0, approved: 0, rejected: 0, suspended: 0, total: 0 };
  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  const doFetch = useCallback(
    (pageNum: number, rowLimit = limit) => {
      dispatch(
        fetchRiderManagement({
          tab: activeTab,
          search: search || undefined,
          vehicleType: vehicleFilter !== "all" ? vehicleFilter.toLowerCase() : undefined,
          page: pageNum,
          limit: rowLimit,
        }),
      );
    },
    [activeTab, search, vehicleFilter, limit, dispatch],
  );

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    doFetch(1, newLimit);
  };

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/"); return; }
    setPage(1);
    doFetch(1);
  }, [activeTab, search, vehicleFilter, navigate, doFetch]);

  useEffect(() => {
    if (approveSuccess) { dispatch(resetApprove()); doFetch(page); }
  }, [approveSuccess, dispatch, doFetch, page]);

  useEffect(() => {
    if (rejectSuccess) { dispatch(resetReject()); doFetch(page); }
  }, [rejectSuccess, dispatch, doFetch, page]);

  useEffect(() => {
    if (suspendSuccess) { dispatch(resetSuspend()); doFetch(page); }
  }, [suspendSuccess, dispatch, doFetch, page]);

  useEffect(() => {
    dispatch(fetchZoneSettings());
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    doFetch(newPage);
  };

  const statCards = [
    { icon: <EmojiEventsIcon sx={{ fontSize: 22 }} />, count: stats?.pending ?? 0,  label: "Pending Approval",  subtitle: "Awaiting review",        color: "#f59e0b", lightColor: "#fffbeb" },
    { icon: <CheckCircleIcon sx={{ fontSize: 22 }} />, count: stats?.approved ?? 0, label: "Approved Partner",   subtitle: "Verified & active",       color: "#16a34a", lightColor: "#f0fdf4" },
    { icon: <CancelIcon      sx={{ fontSize: 22 }} />, count: stats?.rejected ?? 0, label: "Rejected",          subtitle: "Rejected applications",   color: "#dc2626", lightColor: "#fef2f2" },
    { icon: <GroupIcon       sx={{ fontSize: 22 }} />, count: stats?.total ?? 0,    label: "Total Registered",  subtitle: "All time",                color: "#2563eb", lightColor: "#eff6ff" },
  ];

  const currentData = riders.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch  = !q || r.name.toLowerCase().includes(q) || r.phone.includes(q);
    const matchVehicle = vehicleFilter === "all" || capitalizeVehicle(r.vehicleType || "") === vehicleFilter;
    const matchZone    = zoneFilter === "all" || r.zoneId === zoneFilter;
    const matchDoc     =
      docFilter === "all" ||
      (docFilter === "Complete"   && r.hasDL && r.hasRC) ||
      (docFilter === "Incomplete" && (!r.hasDL || !r.hasRC));
    return matchSearch && matchVehicle && matchZone && matchDoc;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day:  date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      year: date.getFullYear().toString(),
    };
  };

  return (
    <AdminLayout pageTitle="Partner Management">
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
              <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>{card.subtitle}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Tabs + Add Rider */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 0, border: "1px solid #e5e7eb", borderRadius: 2, overflow: "hidden", bgcolor: "#fff" }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = tab.key === "pending" ? stats.pending : tab.key === "approved" ? stats.approved : tab.key === "rejected" ? stats.rejected : stats.suspended;
            return (
              <Button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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
                <Box component="span" sx={{ ml: 0.8, px: 0.7, py: 0.1, fontSize: "0.7rem", fontWeight: 700, borderRadius: 10, bgcolor: isActive ? "rgba(255,255,255,0.2)" : "#f3f4f6", color: isActive ? "#fff" : "#6b7280" }}>
                  {count}
                </Box>
              </Button>
            );
          })}
        </Box>

        <Button
          variant="contained" disableElevation startIcon={<AddIcon />}
          onClick={() => navigate("/newRider")}
          sx={{ bgcolor: "#E8490F", color: "#fff", textTransform: "none", fontWeight: 600, fontSize: "0.85rem", borderRadius: 2, px: 2.5, py: 0.9, "&:hover": { bgcolor: "#c93d0c" } }}
        >
          Add Partner
        </Button>
      </Box>

      {/* Filters Row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {/* Search */}
        <OutlinedInput
          size="small"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={<InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} /></InputAdornment>}
          sx={{ fontSize: "0.82rem", borderRadius: 2, height: 36, minWidth: 210, "& fieldset": { borderColor: "#e5e7eb" }, "& input": { py: 0.5 } }}
        />

        {/* Vehicle Filter */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} displayEmpty sx={selectSx}>
            <MenuItem value="all"        sx={{ fontSize: "0.82rem" }}>All Vehicles</MenuItem>
            <MenuItem value="Bike"       sx={{ fontSize: "0.82rem" }}>Bike</MenuItem>
            <MenuItem value="Auto"       sx={{ fontSize: "0.82rem" }}>Auto</MenuItem>
            <MenuItem value="Mini Truck" sx={{ fontSize: "0.82rem" }}>Mini Truck</MenuItem>
            <MenuItem value="Truck"      sx={{ fontSize: "0.82rem" }}>Truck</MenuItem>
          </Select>
        </FormControl>

        {/* Zone Filter */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} displayEmpty sx={selectSx}>
            <MenuItem value="all" sx={{ fontSize: "0.82rem" }}>All Zones</MenuItem>
            {(zoneData?.zones ?? []).map((z) => (
              <MenuItem key={z._id} value={z._id} sx={{ fontSize: "0.82rem" }}>
                {z.name} — {z.city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Doc Status Filter */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select value={docFilter} onChange={(e) => setDocFilter(e.target.value)} displayEmpty sx={selectSx}>
            <MenuItem value="all"        sx={{ fontSize: "0.82rem" }}>All Doc Status</MenuItem>
            <MenuItem value="Complete"   sx={{ fontSize: "0.82rem" }}>Complete</MenuItem>
            <MenuItem value="Incomplete" sx={{ fontSize: "0.82rem" }}>Incomplete</MenuItem>
          </Select>
        </FormControl>

        {/* Clear Filters */}
        {(() => {
          const hasActiveFilters =
            search !== "" ||
            vehicleFilter !== "all" ||
            zoneFilter !== "all" ||
            docFilter !== "all";
          return (
            <Button
              size="small"
              disabled={!hasActiveFilters}
              sx={{
                fontSize: "0.78rem",
                textTransform: "none",
                border: "1px solid",
                borderRadius: 2,
                px: 1.5,
                height: 36,
                color: hasActiveFilters ? "#fff" : "#9ca3af",
                bgcolor: hasActiveFilters ? "#E8490F" : "#f3f4f6",
                borderColor: hasActiveFilters ? "#E8490F" : "#e5e7eb",
                "&:hover": {
                  bgcolor: hasActiveFilters ? "#c93d0c" : "#f3f4f6",
                  borderColor: hasActiveFilters ? "#c93d0c" : "#e5e7eb",
                },
                "&.Mui-disabled": {
                  color: "#9ca3af",
                  bgcolor: "#f3f4f6",
                  borderColor: "#e5e7eb",
                },
              }}
              onClick={() => { setSearch(""); setVehicleFilter("all"); setZoneFilter("all"); setDocFilter("all"); }}
            >
              ✕ Clear Filters
            </Button>
          );
        })()}

        <Box sx={{ flex: 1 }} />
      </Box>

      {/* Info Banner (pending only) */}
      {activeTab === "pending" && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 2, px: 2, py: 1, mb: 2 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b", flexShrink: 0 }} />
          <Typography sx={{ fontSize: "0.82rem", color: "#92400e", fontWeight: 500 }}>
            {currentData.length} riders pending approval — <strong>DL + RC Card required to Approve</strong>
          </Typography>
        </Box>
      )}

      {/* Table */}
      <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: 2, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              {tableHeaders.map((col) => (
                <TableCell key={col} sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", letterSpacing: 0.4, borderBottom: "1px solid #f3f4f6", py: 1.2, px: 2, whiteSpace: "nowrap" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={10} sx={{ textAlign: "center", py: 4, color: "#9ca3af", fontSize: "0.85rem" }}>Loading...</TableCell></TableRow>
            ) : error ? (
              <TableRow><TableCell colSpan={10} sx={{ textAlign: "center", py: 4, color: "#dc2626", fontSize: "0.85rem" }}>Failed to load partners: {error}</TableCell></TableRow>
            ) : currentData.length === 0 ? (
              <TableRow><TableCell colSpan={10} sx={{ textAlign: "center", py: 4, color: "#9ca3af", fontSize: "0.85rem" }}>No partners found</TableCell></TableRow>
            ) : (
              currentData.map((row) => {
                const vehicleLabel = capitalizeVehicle(row.vehicleType || "");
                const vStyle = vehicleStyle[vehicleLabel] ?? { bg: "#f3f4f6", color: "#374151" };
                const { day, year } = formatDate(row.createdAt);

                return (
                  <TableRow key={row._id} sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: "#fafafa" } }}>
                    {/* Rider */}
                    <TableCell sx={{ py: 1.4, px: 2, minWidth: 160 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Avatar src={row.profilePhotoUrl ?? undefined} sx={{ width: 34, height: 34, bgcolor: getAvatarColor(row.name), fontSize: "0.7rem", fontWeight: 700 }}>
                          {getInitials(row.name)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: "#111827" }}>{row.name}</Typography>
                          <Typography sx={{ fontSize: "0.68rem", color: "#9ca3af" }}>Self Sign Up</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Phone */}
                    <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2, whiteSpace: "nowrap" }}>{row.phone}</TableCell>

                    {/* Vehicle */}
                    <TableCell sx={{ py: 1.4, px: 2 }}>
                      <Chip label={vehicleLabel} size="small" sx={{ fontSize: "0.7rem", fontWeight: 600, height: 22, bgcolor: vStyle.bg, color: vStyle.color, border: "none", borderRadius: 1.5, "& .MuiChip-label": { px: 1 } }} />
                    </TableCell>

                    {/* Zone */}
                    <TableCell sx={{ fontSize: "0.8rem", color: "#4b5563", py: 1.4, px: 2 }}>{row.zoneId ?? "—"}</TableCell>

                    {/* Submitted */}
                    <TableCell sx={{ py: 1.4, px: 2 }}>
                      <Typography sx={{ fontSize: "0.78rem", color: "#374151", fontWeight: 500 }}>{day}</Typography>
                      <Typography sx={{ fontSize: "0.68rem", color: "#9ca3af" }}>{year}</Typography>
                    </TableCell>

                    {/* Documents */}
                    <TableCell sx={{ py: 1.4, px: 2 }}>
                      <Box sx={{ display: "flex", gap: 0.6 }}>
                        <DocBadge label="DL" verified={row.hasDL} />
                        <DocBadge label="RC" verified={row.hasRC} />
                      </Box>
                    </TableCell>

                    {/* Online Status */}
                    <TableCell sx={{ py: 1.4, px: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                        <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: row.isOnline ? "#16a34a" : "#9ca3af" }} />
                        <Typography sx={{ fontSize: "0.78rem", fontWeight: 500, color: row.isOnline ? "#16a34a" : "#6b7280" }}>
                          {row.isOnline ? "Online" : "Offline"}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Trips */}
                    <TableCell sx={{ fontSize: "0.82rem", color: "#374151", fontWeight: 500, py: 1.4, px: 2 }}>
                      {row.trips > 0 ? row.trips : <span style={{ color: "#d1d5db" }}>—</span>}
                    </TableCell>

                    {/* Rating */}
                    <TableCell sx={{ py: 1.4, px: 2 }}>
                      {row.avgRating !== null ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                          <StarIcon sx={{ fontSize: 13, color: "#f59e0b" }} />
                          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>{row.avgRating.toFixed(1)}</Typography>
                        </Box>
                      ) : (
                        <span style={{ color: "#d1d5db", fontSize: "0.82rem" }}>—</span>
                      )}
                    </TableCell>

                    {/* Account Status + View */}
                    <TableCell sx={{ py: 1.4, px: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {(() => {
                          const s = row.accountStatus || "—";
                          const styleMap: Record<string, { bg: string; color: string; border: string }> = {
                            pending:   { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
                            approved:  { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
                            rejected:  { bg: "#fee2e2", color: "#b91c1c", border: "#fecaca" },
                            suspended: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
                          };
                          const st = styleMap[s] ?? { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
                          return (
                            <Chip
                              label={s.charAt(0).toUpperCase() + s.slice(1)}
                              size="small"
                              sx={{ bgcolor: st.bg, color: st.color, border: `1px solid ${st.border}`, fontSize: "0.7rem", fontWeight: 600, height: 22, borderRadius: 1, "& .MuiChip-label": { px: 1 } }}
                            />
                          );
                        })()}
                        <Button
                          size="small"
                          onClick={() => navigate(`/riders/${row._id}`)}
                          sx={{ fontSize: "0.72rem", fontWeight: 500, textTransform: "none", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 1.5, px: 1.2, py: 0.4, minWidth: 0, "&:hover": { bgcolor: "#f9fafb" } }}
                        >
                          View Profile
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <Box sx={{ px: 2, py: 1.2, borderTop: "1px solid #f3f4f6" }}>
          <TablePagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default RiderManagement;
