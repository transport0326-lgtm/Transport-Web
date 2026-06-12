import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Chip, Skeleton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AdminLayout from '../../components/layout/AdminLayout';
import { timeAgoOrDate } from "../../utils/format";
import { fetchNotifications } from "../../redux/sagas/notifications/notificationsAction";
import { fetchAlertsCount } from "../../redux/sagas/notifications/notificationsCountAction";
import { markAlertsRead } from "../../redux/sagas/notifications/markAlertsReadAction";
import type { RootState } from "../../redux/stores/store";
import type { Alert } from "../../redux/slices/notificationsSlice";

// ─── helpers ────────────────────────────────────────────────────────────────

const getCardStyle = (type: string) => {
  switch (type) {
    case "pending":
      return {
        border: "1px solid #fcd9c4",
        borderLeft: "4px solid #e17c3e",
        bgcolor: "#e17c3e",
      };
    case "warning":
      return {
        border: "1px solid #fbcfe8",
        borderLeft: "4px solid red",
        bgcolor: "#fdf2f8",
      };
    default:
      return {
        border: "1px solid #e17c3e",
        borderLeft: "4px solid #F78C12",
        bgcolor: "#f5f9ff",
      };
  }
};

const getChipStyle = (type: string) => {
  switch (type) {
    case "pending":
      return { bgcolor: "#ffe6d6", color: "#dfbf40" };
    case "warning":
      return { bgcolor: "#fce7f3", color: "red" };
    default:
      return { bgcolor: "#dbeafe", color: "#F78C12" };
  }
};

const getActionColor = (type: string) => {
  switch (type) {
    case "pending":
      return "#e17c3e";
    case "warning":
      return "red";
    default:
      return "#F78C12";
  }
};

// ─── Alert Card ──────────────────────────────────────────────────────────────

const AlertCard: React.FC<{ alert: Alert }> = ({ alert }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resolveRoute = (href: string): string => {
    if (!href) return "/riders";
    let pathname = href;
    let search = "";
    try {
      const url = new URL(href, window.location.origin);
      pathname = url.pathname;
      search = url.search;
    } catch {
      const [p, q] = href.split("?");
      pathname = p;
      search = q ? `?${q}` : "";
    }

    const lower = pathname.toLowerCase();

    if (lower.includes("rider-management") || lower.includes("rider_management") || lower.includes("riders")) {
      return "/riders" + search;
    }
    if (lower.includes("live-booking") || lower.includes("live_booking") || lower.includes("bookings")) {
      return "/live-bookings" + search;
    }
    if (lower.includes("fleet")) return "/fleet" + search;
    if (lower.includes("report")) return "/reports" + search;
    if (lower.includes("setting")) return "/settings" + search;
    if (lower.includes("support") || lower.includes("chat")) return "/support-chat" + search;
    if (lower.includes("expense")) return "/expense" + search;
    if (lower.includes("dashboard")) return "/dashboard" + search;

    return pathname + search;
  };

  const handleAction = () => {
    dispatch(markAlertsRead({ id: alert.id }));
    const target = resolveRoute(alert.action.href);
    navigate(target);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        ...getCardStyle(alert.type),
        borderRadius: 2,
        px: 2.5,
        py: 2,
        mb: 2,
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          bgcolor:
            alert.type === "warning"
              ? "#fce7f3"
              : alert.type === "pending"
              ? "#ffe6d6"
              : "#dbeafe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mt: 0.3,
        }}
      >
        {alert.type === "warning" ? (
          <WarningAmberIcon sx={{ fontSize: 20, color: "#be185d" }} />
        ) : (
          <PersonIcon
            sx={{
              fontSize: 22,
              color: alert.type === "pending" ? "#E8490F" : "#2563eb",
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Chip
            label={alert.type.toUpperCase()}
            size="small"
            sx={{
              ...getChipStyle(alert.type),
              fontSize: "0.65rem",
              fontWeight: 700,
              height: 20,
              borderRadius: 1,
              "& .MuiChip-label": { px: 0.8 },
            }}
          />
          <Typography
            sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#1a1a2e" }}
          >
            {alert.title}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mb: 1 }}>
          {alert.message}
        </Typography>

        <Typography
          onClick={handleAction}
          sx={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: getActionColor(alert.type),
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {alert.action.label} →
        </Typography>
      </Box>

      {/* Timestamp */}
      <Typography
        sx={{
          fontSize: "0.75rem",
          color: "#9ca3af",
          whiteSpace: "nowrap",
          mt: 0.3,
        }}
      >
        {timeAgoOrDate(alert.createdAt)}
      </Typography>
    </Box>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.notifications,
  );
  const { data: alertsCount } = useSelector(
    (state: RootState) => state.alertsCount,
  );

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchAlertsCount());
  }, []);

  return (
    <AdminLayout pageTitle="Notifications">
      <Box sx={{ maxWidth: 10000 }}>
        {/* Section label */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#E8490F",
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#E8490F" }}
          >
            Action Required
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af" }}>
            — needs your attention
          </Typography>
          {alertsCount?.count != null && (
            <Chip
              label={`${alertsCount.count} unread`}
              size="small"
              sx={{
                bgcolor: "#ffe6d6",
                color: "#E8490F",
                fontSize: "0.68rem",
                fontWeight: 700,
                height: 20,
                borderRadius: 1,
                "& .MuiChip-label": { px: 0.8 },
              }}
            />
          )}
        </Box>

        {/* Loading */}
        {loading && (
          <>
            {[1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  border: "1px solid #f0f0f0",
                  borderLeft: "4px solid #e5e7eb",
                  borderRadius: 2,
                  px: 2.5,
                  py: 2,
                  mb: 2,
                }}
              >
                <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                <Skeleton width="70%" height={16} sx={{ mb: 1 }} />
                <Skeleton width="25%" height={16} />
              </Box>
            ))}
          </>
        )}

        {/* Error */}
        {error && (
          <Typography sx={{ fontSize: "0.82rem", color: "#dc2626", py: 2 }}>
            {error}
          </Typography>
        )}

        {/* Empty */}
        {!loading && !error && (data?.alerts ?? []).length === 0 && (
          <Typography
            sx={{
              fontSize: "0.82rem",
              color: "#9ca3af",
              py: 4,
              textAlign: "center",
            }}
          >
            No alerts at the moment 🎉
          </Typography>
        )}

        {/* Alert cards */}
        {!loading &&
          (data?.alerts ?? []).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}

        {/* Footer */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: "center",
            py: 2,
            borderTop: "1px solid #f3f4f6",
            bgcolor: "#f9fafb",
          }}
        >
          <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
            Only showing alerts that need your attention · Routine events are
            filtered out
          </Typography>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default NotificationsPage;
