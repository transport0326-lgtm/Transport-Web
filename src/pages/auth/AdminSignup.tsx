import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ROLES = [
  "Super Admin",
  "Admin",
  "Operations Manager",
  "Fleet Manager",
  "Support Agent",
];

const AdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!fullName || !email || !role || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    // API integration pending
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Panel */}
      <Box
        sx={{
          width: "45%",
          background:
            "linear-gradient(160deg, #0D1B3E 0%, #1a2f5e 60%, #0D1B3E 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(232, 73, 15, 0.06)",
            top: -100,
            left: -100,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(232, 73, 15, 0.05)",
            bottom: -80,
            right: -80,
          },
        }}
      >
        <Box sx={{ mb: 3, zIndex: 1 }}>
          <Box
            component="img"
            src="/logo.png?v=2"
            alt="Transpport"
            sx={{ width: 200, objectFit: "contain" }}
          />
        </Box>
        <Box sx={{ textAlign: "center", zIndex: 1, px: 4 }}>
          <Typography
            variant="h4"
            sx={{ color: "#fff", fontWeight: 700, fontSize: "1.8rem", mb: 1 }}
          >
            You Are Transpport.
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.85rem",
              fontWeight: 500,
              letterSpacing: 0.5,
              mb: 0.5,
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}
          >
            Manage your fleet, bookings, and partners
          </Typography>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#f0f2f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: 400,
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#1a1a2e", mb: 0.5 }}
            >
              Create Admin Account
            </Typography>
            <Typography sx={{ color: "#8a8a9a", fontSize: "0.85rem", mb: 2.5 }}>
              Fill in the details to set up your admin access
            </Typography>

            <Box
              component="hr"
              sx={{ border: "none", borderTop: "1px solid #e1e1e1", mb: 2.5 }}
            />

            <Box component="form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#444",
                  mb: 0.5,
                }}
              >
                Full Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                sx={{ mb: 2.5 }}
              />

              {/* Email Address */}
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#444",
                  mb: 0.5,
                }}
              >
                Email Address
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="admin@transpport.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2.5 }}
              />

              {/* Role / Position */}
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#444",
                  mb: 0.5,
                }}
              >
                Role / Position
              </Typography>
              <TextField
                fullWidth
                select
                size="small"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{ mb: 2.5 }}
                slotProps={{
                  select: {
                    displayEmpty: true,
                    renderValue: (value) =>
                      value ? String(value) : "Select role…",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select role…
                </MenuItem>
                {ROLES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>

              {/* Password */}
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#444",
                  mb: 0.5,
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Create a password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 2.5 }}
              />

              {/* Confirm Password */}
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#444",
                  mb: 0.5,
                }}
              >
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Re-enter your password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 2 }}
              />

              {error && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#c62828",
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  {error}
                </Typography>
              )}

              {/* Create Account Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#E8490F",
                  "&:hover": { backgroundColor: "#c93d0c" },
                  boxShadow: "0 4px 14px rgba(232, 73, 15, 0.35)",
                  mb: 1.5,
                }}
              >
                Create Account
              </Button>

              {/* Sign In link */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  component="span"
                  sx={{ fontSize: "0.82rem", color: "#737373" }}
                >
                  Already have an account?{" "}
                </Typography>
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={() => navigate("/admin/login")}
                  sx={{
                    fontSize: "0.82rem",
                    color: "#E8490F",
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Typography sx={{ mt: 3, fontSize: "0.75rem", color: "#aaa" }}>
          © 2026 Transpport. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminSignup;
