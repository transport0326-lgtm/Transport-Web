import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  Typography,
  Chip,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AdminLayout from "../../components/layout/AdminLayout";
import TablePagination from "../../components/common/TablePagination";
import { timeAgo } from "../../utils/format";
import { fetchLiveBookings } from "../../redux/sagas/liveBookings/liveBookingSagaAction";
import type { RootState } from "../../redux/stores/store";
import type { LiveBookingOrder } from "../../redux/slices/liveBookingSlice";

// ── Status mapping: API status → UI label ──────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  pending: "Unassigned",
  assigned: "Assigned",
  arrived_at_pickup: "Picked Up",
  in_transit: "In Transit",
  completed: "Delivered",
  cancelled: "Cancelled",
};

const statusStyle: Record<string, { bgcolor: string; color: string }> = {
  Unassigned: { bgcolor: "#fdecea", color: "#c62828" },
  Assigned: { bgcolor: "#ede7f6", color: "#6a1b9a" },
  "Picked Up": { bgcolor: "#fff3e0", color: "#e65100" },
  "In Transit": { bgcolor: "#e3f2fd", color: "#1565c0" },
  Delivered: { bgcolor: "#e8f5e9", color: "#2e7d32" },
  Cancelled: { bgcolor: "#f5f5f5", color: "#757575" },
};

const TAB_FILTERS = [
  "All",
  "Unassigned",
  "Assigned",
  "Picked Up",
  "Completed",
  "Cancelled",
] as const;

// UI tab label → API status value
const TAB_TO_API_STATUS: Partial<Record<(typeof TAB_FILTERS)[number], string>> =
  {
    Unassigned: "pending",
    Assigned: "assigned",
    "Picked Up": "arrived_at_pickup",
    Completed: "completed",
    Cancelled: "cancelled",
  };

// ── Helpers ────────────────────────────────────────────────────────────────
const getLabel = (apiStatus: string) => STATUS_LABEL[apiStatus] ?? apiStatus;

const shortRoute = (pickup: string, dropoff: string) => {
  const trim = (s: string) => s.split(",")[0].trim();
  return `${trim(pickup)} → ${trim(dropoff)}`;
};

// ── Component ──────────────────────────────────────────────────────────────

const LiveBookings: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.liveBookings,
  );

  const isInitialMount = useRef(true);

  // Tab change: reset page + immediate fetch using current search/limit.
  // Intentionally only depends on `tab` — search has its own debounced effect
  // below; including search/limit here would cause double fetches on every keystroke.
  useEffect(() => {
    setPage(1);
    const apiStatus = TAB_TO_API_STATUS[TAB_FILTERS[tab]];
    dispatch(fetchLiveBookings({ status: apiStatus, search, page: 1, limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tab]);

  // Search change: reset page + debounced fetch (skip initial mount).
  // Only depends on `search` — tab/limit changes are handled by their own effects/handlers.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const apiStatus = TAB_TO_API_STATUS[TAB_FILTERS[tab]];
    const id = setTimeout(() => {
      setPage(1);
      dispatch(
        fetchLiveBookings({ status: apiStatus, search, page: 1, limit }),
      );
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const apiStatus = TAB_TO_API_STATUS[TAB_FILTERS[tab]];
    dispatch(
      fetchLiveBookings({ status: apiStatus, search, page: newPage, limit }),
    );
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    const apiStatus = TAB_TO_API_STATUS[TAB_FILTERS[tab]];
    dispatch(
      fetchLiveBookings({
        status: apiStatus,
        search,
        page: 1,
        limit: newLimit,
      }),
    );
  };

  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  const orders: LiveBookingOrder[] = data?.orders ?? [];
  const stats = data?.stats;

  const statCards = [
    {
      label: "Active Orders",
      value: stats?.activeOrders ?? 0,
      color: "#0D1B3E",
    },
    { label: "Unassigned", value: stats?.unassigned ?? 0, color: "#c62828" },
    { label: "Assigned", value: stats?.assigned ?? 0, color: "#1976d2" },
    { label: "Picked Up", value: stats?.awaitingPickup ?? 0, color: "#E8490F" },
    { label: "Delivered", value: stats?.completed ?? 0, color: "#2e7d32" },
    { label: "Cancelled", value: stats?.cancelled ?? 0, color: "#757575" },
  ];

  const tabLabels = [
    `All (${data?.total ?? 0})`,
    `Unassigned (${stats?.unassigned ?? 0})`,
    `Assigned (${stats?.assigned ?? 0})`,
    `Picked Up (${stats?.awaitingPickup ?? 0})`,
    `Delivered (${stats?.completed ?? 0})`,
    `Cancelled (${stats?.cancelled ?? 0})`,
  ];

  return (
    <AdminLayout
      pageTitle={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1.1rem" }}
          >
            Live Bookings
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "#fdecea",
              borderRadius: 1,
              px: 1,
              py: 0.3,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "#e53935",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.3 },
                  "100%": { opacity: 1 },
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#e53935",
                letterSpacing: 0.5,
              }}
            >
              LIVE
            </Typography>
          </Box>
        </Box>
      }
    >
      {/* Stat Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
        {statCards.map((card) => (
          <Box
            key={card.label}
            sx={{
              flex: 1,
              bgcolor: "#fff",
              border: "1px solid #eee",
              borderLeft: `3px solid ${card.color}`,
              borderRadius: 2,
              px: 2,
              py: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "#1a1a2e",
                lineHeight: 1.1,
              }}
            >
              {loading ? "—" : card.value}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#999", mt: 0.3 }}>
              {card.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Main Card */}
      <Card elevation={0} sx={{ border: "1px solid #eee", borderRadius: 2 }}>
        {/* Tabs + Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
            px: 1,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              minHeight: 44,
              "& .MuiTab-root": {
                fontSize: "0.8rem",
                textTransform: "none",
                minHeight: 44,
                fontWeight: 500,
                color: "#888",
                px: 2,
              },
              "& .Mui-selected": { color: "#1a1a2e", fontWeight: 700 },
              "& .MuiTabs-indicator": { bgcolor: "#0D1B3E", height: 2 },
            }}
          >
            {tabLabels.map((label, i) => (
              <Tab key={i} label={label} />
            ))}
          </Tabs>

          <OutlinedInput
            size="small"
            placeholder="Search orders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: "#bbb" }} />
              </InputAdornment>
            }
            sx={{
              fontSize: "0.8rem",
              borderRadius: 2,
              mr: 1.5,
              height: 32,
              "& fieldset": { borderColor: "#e0e0e0" },
              "& input": { py: 0.5 },
            }}
          />
        </Box>

        {/* Loading / Error / Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} sx={{ color: "#E8490F" }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography sx={{ color: "#c62828", fontSize: "0.85rem" }}>
              {error}
            </Typography>
            <Button
              onClick={() => dispatch(fetchLiveBookings())}
              sx={{ mt: 1, fontSize: "0.8rem", color: "#E8490F" }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                {[
                  "Order ID",
                  "Route",
                  "Customer",
                  "Partner",
                  "Vehicle",
                  "Amount",
                  "Status",
                  "Time",
                ].map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      color: "#aaa",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      borderBottom: "1px solid #f0f0f0",
                      py: 1.2,
                      px: 2,
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    sx={{
                      textAlign: "center",
                      py: 4,
                      color: "#bbb",
                      fontSize: "0.85rem",
                    }}
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((row: LiveBookingOrder) => {
                  const uiStatus = getLabel(row.status);
                  const style = statusStyle[uiStatus] ?? {
                    bgcolor: "#f5f5f5",
                    color: "#555",
                  };
                  return (
                    <TableRow
                      key={row.bookingNumber}
                      sx={{
                        "&:last-child td": { border: 0 },
                        "&:hover": { bgcolor: "#fafafa" },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          color: "#1a1a2e",
                          py: 1.4,
                          px: 2,
                        }}
                      >
                        {row.bookingNumber}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.82rem",
                          color: "#444",
                          py: 1.4,
                          px: 2,
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {shortRoute(row.pickup, row.dropoff)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.82rem",
                          color: "#444",
                          py: 1.4,
                          px: 2,
                        }}
                      >
                        {row.customerName}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.82rem",
                          color: "#666",
                          py: 1.4,
                          px: 2,
                        }}
                      >
                        {row.riderName}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.82rem",
                          color: "#666",
                          py: 1.4,
                          px: 2,
                          textTransform: "capitalize",
                        }}
                      >
                        {row.vehicleType}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.82rem",
                          fontWeight: 500,
                          color: "#444",
                          py: 1.4,
                          px: 2,
                        }}
                      >
                        ₹{row.amount}
                      </TableCell>
                      <TableCell sx={{ py: 1.4, px: 2 }}>
                        {(() => {
                          const cancelVariants: Record<
                            string,
                            { label: string; bgcolor: string; color: string }
                          > = {
                            rider:    { label: "Cancelled by Partner",  bgcolor: "#ede7f6", color: "#5b21b6" },
                            user:     { label: "Cancelled by Customer", bgcolor: "#fee2e2", color: "#b91c1c" },
                            customer: { label: "Cancelled by Customer", bgcolor: "#fee2e2", color: "#b91c1c" },
                            system:   { label: "Cancelled by System",   bgcolor: "#fff7ed", color: "#c2410c" },
                          };
                          const variant =
                            uiStatus === "Cancelled" && row.cancelledBy
                              ? cancelVariants[row.cancelledBy]
                              : undefined;
                          const chipLabel = variant?.label ?? uiStatus;
                          const chipStyle = variant ?? style;
                          return (
                            <Chip
                              label={chipLabel}
                              size="small"
                              sx={{
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                height: 22,
                                borderRadius: 1,
                                bgcolor: chipStyle.bgcolor,
                                color: chipStyle.color,
                              }}
                            />
                          );
                        })()}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.78rem",
                          color: "#aaa",
                          py: 1.4,
                          px: 2,
                        }}
                      >
                        {timeAgo(row.createdAt)}
                      </TableCell>
                      {/* <TableCell sx={{ py: 1.4, px: 2 }}>
                        {uiStatus === 'Unassigned' && (
                          <Button size="small" variant="contained" disableElevation
                            sx={{ bgcolor: '#E8490F', color: '#fff', fontSize: '0.75rem', textTransform: 'none', borderRadius: 1.5, px: 2, py: 0.3, '&:hover': { bgcolor: '#c93d0c' } }}>
                            Assign
                          </Button>
                        )}
                        {['Assigned', 'Picked Up', 'In Transit'].includes(uiStatus) && (
                          <Button size="small" variant="outlined"
                            sx={{ borderColor: '#ddd', color: '#555', fontSize: '0.75rem', textTransform: 'none', borderRadius: 1.5, px: 2, py: 0.3, '&:hover': { borderColor: '#aaa', bgcolor: '#fafafa' } }}>
                            Track
                          </Button>
                        )}
                        {['Delivered', 'Cancelled'].includes(uiStatus) && (
                          <Button size="small" variant="outlined"
                            sx={{ borderColor: '#ddd', color: '#555', fontSize: '0.75rem', textTransform: 'none', borderRadius: 1.5, px: 2, py: 0.3, '&:hover': { borderColor: '#aaa', bgcolor: '#fafafa' } }}>
                            View
                          </Button>
                        )}
                      </TableCell> */}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination + Rows per page */}
        {!loading && !error && (
          <Box sx={{ px: 2, py: 1.5, borderTop: "1px solid #f0f0f0" }}>
            <TablePagination
              page={page}
              totalPages={totalPages}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </Box>
        )}
      </Card>
    </AdminLayout>
  );
};

export default LiveBookings;
