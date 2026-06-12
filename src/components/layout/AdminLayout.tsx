import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Avatar,
  Badge,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ForumIcon from "@mui/icons-material/Forum";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlertsCount } from "../../redux/sagas/notifications/notificationsCountAction";
import { fetchSupportCount } from "../../redux/sagas/supportChat/supportCountAction";
import type { RootState } from '../../redux/stores/store';
import { clearSession } from '../../utils/auth';
import { clearLogin } from '../../redux/slices/loginSlice';

const SIDEBAR_WIDTH = 220;

const navItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    path: "/dashboard",
  },
  {
    label: "Live Bookings",
    icon: <BookOnlineIcon fontSize="small" />,
    path: "/live-bookings",
  },
  {
    label: "Partner Management",
    icon: <PeopleIcon fontSize="small" />,
    path: "/riders",
  },
  {
    label: "Fleet Tracking",
    icon: <LocationOnIcon fontSize="small" />,
    path: "/fleet",
  },
  {
    label: "Reports",
    icon: <BarChartIcon fontSize="small" />,
    path: "/reports",
  },
  {
    label: "Expense",
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    path: "/expense",
  },
  {
    label: "Support Chat",
    icon: <ForumIcon fontSize="small" />,
    path: "/support-chat",
  },
  {
    label: "Website Leads",
    icon: <ContactMailIcon fontSize="small" />,
    path: "/website-leads",
  },
  {
    label: "Settings",
    icon: <SettingsIcon fontSize="small" />,
    path: "/settings",
  },
];

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  pageTitle,
  breadcrumbs,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [active, setActive] = useState(location.pathname);

  const { data: alertsCountData } = useSelector(
    (state: RootState) => state.alertsCount,
  );
  const { data: supportCountData } = useSelector(
    (state: RootState) => state.supportCount,
  );

  useEffect(() => {
    dispatch(fetchAlertsCount());
    dispatch(fetchSupportCount());
  }, []);

  const handleNav = (path: string) => {
    setActive(path);
    navigate(path);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f5f6fa",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          height: "100vh",
          position: "sticky",
          top: 0,
          bgcolor: "#0D1B3E",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflowY: "auto",
        }}
      >
        <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
          <Box
            component="img"
            src="/logo.png?v=2"
            alt="Transpport"
            sx={{ width: 140, mb: 0.5 }}
          />
          <Typography
            sx={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.72rem",
              letterSpacing: 0.5,
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>

        <List sx={{ px: 1.5, flex: 1 }}>
          {navItems.map((item) => {
            const isActive = active === item.path;
            return (
              <ListItemButton
                key={item.path}
                onClick={() => handleNav(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: 1.5,
                  py: 1,
                  bgcolor: isActive ? "#E8490F" : "transparent",
                  "&:hover": {
                    bgcolor: isActive ? "#c93d0c" : "rgba(255,255,255,0.07)",
                  },
                  gap: 1.2,
                }}
              >
                <Box
                  sx={{
                    color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                    display: "flex",
                  }}
                >
                  {item.label === "Support Chat" && (supportCountData?.count ?? 0) > 0 ? (
                    <Badge
                      badgeContent={supportCountData!.count}
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: "#E8490F",
                          color: "#fff",
                          fontSize: "0.6rem",
                          minWidth: 16,
                          height: 16,
                          p: 0,
                        },
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </Box>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.85rem",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ px: 1.5, pb: 2.5 }}>
          <ListItemButton
            onClick={() => {
              clearSession();
              dispatch(clearLogin());
              navigate('/admin/login');
            }}
            sx={{
              borderRadius: 2,
              px: 1.5,
              py: 1,
              gap: 1.2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.07)" },
            }}
          >
            <Box sx={{ color: "rgba(255,255,255,0.5)", display: "flex" }}>
              <LogoutIcon fontSize="small" />
            </Box>
            <ListItemText
              primary="Logout"
              slotProps={{
                primary: {
                  sx: {
                    fontSize: "0.85rem",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.6)",
                  },
                },
              }}
            />
          </ListItemButton>
        </Box>
      </Box>

      {/* Main */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            bgcolor: "#fff",
            px: 3,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #eee",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          {/* Left: breadcrumb or title */}
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() =>
                  breadcrumbs[0].path
                    ? navigate(breadcrumbs[0].path!)
                    : navigate(-1 as any)
                }
                sx={{
                  color: "#6b7280",
                  p: 0.4,
                  mr: 0.2,
                  "&:hover": { bgcolor: "#f3f4f6" },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
              </IconButton>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <Typography
                      sx={{ color: "#9ca3af", fontSize: "0.9rem", mx: 0.3 }}
                    >
                      /
                    </Typography>
                  )}
                  <Typography
                    onClick={() => crumb.path && navigate(crumb.path!)}
                    sx={{
                      fontSize: "0.92rem",
                      fontWeight: i < breadcrumbs.length - 1 ? 500 : 700,
                      color: i < breadcrumbs.length - 1 ? "#6b7280" : "#1a1a2e",
                      cursor: crumb.path ? "pointer" : "default",
                      "&:hover": crumb.path
                        ? { textDecoration: "underline" }
                        : {},
                    }}
                  >
                    {crumb.label}
                  </Typography>
                </React.Fragment>
              ))}
            </Box>
          ) : typeof pageTitle === "string" ? (
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1.1rem" }}
            >
              {pageTitle}
            </Typography>
          ) : (
            pageTitle
          )}

          {/* Right: notifications + user */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              size="small"
              onClick={() => navigate("/notifications")}
              sx={{ color: "#6b7280", "&:hover": { bgcolor: "#f3f4f6" } }}
            >
              <Badge
                badgeContent={alertsCountData?.count ?? 0}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#E8490F",
                    color: "#fff",
                    fontSize: "0.6rem",
                    minWidth: 16,
                    height: 16,
                    p: 0,
                  },
                }}
              >
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
            <Typography
              sx={{ fontSize: "0.85rem", color: "#555", fontWeight: 500 }}
            >
              Admin User
            </Typography>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#E8490F",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              A
            </Avatar>
          </Box>
        </Box>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
