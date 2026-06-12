import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../redux/sagas/auth/resetPasswordSagaAction';
import type { RootState } from '../../redux/stores/store';
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
  Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CheckIcon from '@mui/icons-material/Check';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const strengthColors = ['#e1e1e1', '#e53935', '#fb8c00', '#1eac60', '#1eac60'];

const ResetPassword: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { success, loading, error: apiError } = useSelector((state: RootState) => state.resetPassword);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getStrength(password);

  const requirements: PasswordRequirement[] = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter (A–Z)', met: /[A-Z]/.test(password) },
    { label: 'One number (0–9)', met: /[0-9]/.test(password) },
    { label: 'One special character (!@#$...)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm;
  const passwordMismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!passwordsMatch || strength < 2 || !token) return;
    dispatch(resetPassword({ token, newPassword: password }));
  };

  const segmentColor = (index: number) => {
    if (password.length === 0) return '#e1e1e1';
    return index < strength ? strengthColors[strength] : '#e1e1e1';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Panel */}
      <Box
        sx={{
          width: '45%',
          background: 'linear-gradient(160deg, #0D1B3E 0%, #1a2f5e 60%, #0D1B3E 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            bottom: -60,
            left: -60,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            top: 50,
            right: -60,
          },
        }}
      >
        <Box sx={{ mb: 3, zIndex: 1 }}>
          <Box
            component="img"
            src="/logo.png?v=2"
            alt="Transpport"
            sx={{ width: 200, objectFit: 'contain' }}
          />
        </Box>
        <Box sx={{ textAlign: 'center', zIndex: 1, px: 4 }}>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.8rem', mb: 1 }}>
            You Are Transpport.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: 0.5, mb: 0.5 }}>
            Admin Dashboard
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            Manage your fleet, bookings, and partners
          </Typography>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#fbf9f8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!token ? (
          /* Invalid / missing token */
          <Card
            elevation={0}
            sx={{ width: 440, borderRadius: '16px', border: 'none', boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.08)' }}
          >
            <CardContent sx={{ p: '36px', textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80, height: 80, borderRadius: '50%',
                  backgroundColor: 'rgba(229, 57, 53, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2.5, fontSize: 36,
                }}
              >
                ⚠️
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1c1c1c', fontSize: '22px', mb: 1 }}>
                Invalid Reset Link
              </Typography>
              <Typography sx={{ color: '#737373', fontSize: '13px', lineHeight: 1.7, mb: 3 }}>
                This password reset link is invalid or has expired.<br />
                Please request a new one.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/admin/forgot-password')}
                sx={{
                  backgroundColor: '#f75522', '&:hover': { backgroundColor: '#d94419' },
                  borderRadius: '12px', height: '52px', fontSize: '15px', fontWeight: 700,
                }}
              >
                Request New Link
              </Button>
            </CardContent>
          </Card>
        ) : success ? (
          /* Password Reset Success Card */
          <Card
            elevation={0}
            sx={{ width: 440, borderRadius: '16px', border: 'none', boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.08)' }}
          >
            <CardContent sx={{ p: '36px', textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80, height: 80, borderRadius: '50%',
                  backgroundColor: 'rgba(30, 172, 96, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2.5,
                }}
              >
                <CheckIcon sx={{ fontSize: 38, color: '#1eac60' }} />
              </Box>

              <Typography sx={{ fontWeight: 700, color: '#1c1c1c', fontSize: '22px', mb: 1 }}>
                Password Reset!
              </Typography>
              <Typography sx={{ color: '#737373', fontSize: '13px', lineHeight: 1.7, mb: 3 }}>
                Your password has been successfully updated.<br />
                You can now sign in with your new password.
              </Typography>

              <Box
                sx={{
                  backgroundColor: 'rgba(30, 172, 96, 0.08)',
                  borderRadius: '10px', px: 2, py: 1.5, mb: 3,
                }}
              >
                <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#1a7340', textAlign: 'center' }}>
                  🔒&nbsp; Your account is now secured with the new password
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/admin/login')}
                sx={{
                  backgroundColor: '#f75522', '&:hover': { backgroundColor: '#d94419' },
                  boxShadow: '0 4px 14px rgba(247, 85, 34, 0.35)',
                  borderRadius: '12px', height: '52px', fontSize: '15px', fontWeight: 700,
                }}
              >
                Sign In to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Reset Password Form */
          <Card
            elevation={0}
            sx={{ width: 440, borderRadius: '16px', border: 'none', boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.08)' }}
          >
            <CardContent sx={{ p: '36px', textAlign: 'center' }}>
              <Box
                sx={{
                  width: 72, height: 72, borderRadius: '36px',
                  backgroundColor: 'rgba(247, 85, 34, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2, fontSize: 28,
                }}
              >
                🔑
              </Box>

              <Typography sx={{ fontWeight: 700, color: '#1c1c1c', fontSize: '22px', mb: 1 }}>
                Set New Password
              </Typography>
              <Typography sx={{ color: '#737373', fontSize: '13px', mb: 2.5, lineHeight: 1.6 }}>
                Your new password must be different from your previous password.
              </Typography>

              <Divider sx={{ mb: 2.5, borderColor: '#e1e1e1' }} />

              <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'left' }}>
                {/* New Password */}
                <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1c1c1c', mb: 0.75 }}>
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter new password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ fontSize: 15, color: '#a6a6a6' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
                            {showPassword
                              ? <VisibilityOffOutlinedIcon sx={{ fontSize: 16, color: '#a6a6a6' }} />
                              : <VisibilityOutlinedIcon sx={{ fontSize: 16, color: '#a6a6a6' }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: '#f7f7f7', borderRadius: '10px', height: '46px',
                        '& fieldset': { borderColor: '#e1e1e1' },
                      },
                    },
                  }}
                  sx={{ mb: 1.5 }}
                />

                {/* Strength bar */}
                <Box sx={{ display: 'flex', gap: '6px', mb: 0.5 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        flex: 1, height: 5, borderRadius: '3px',
                        backgroundColor: segmentColor(i),
                        transition: 'background-color 0.3s',
                      }}
                    />
                  ))}
                </Box>
                {password.length > 0 && (
                  <Typography sx={{ fontSize: '11px', fontWeight: 600, color: strengthColors[strength], mb: 1.5 }}>
                    {strengthLabels[strength]} password
                  </Typography>
                )}

                {/* Requirements checklist */}
                <Box sx={{ backgroundColor: 'rgba(30, 172, 96, 0.05)', borderRadius: '10px', px: 1.5, py: 1, mb: 2.5 }}>
                  {requirements.map((req) => (
                    <Box key={req.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, py: '3px' }}>
                      <Typography
                        sx={{ fontSize: '12px', fontWeight: 600, color: req.met ? '#1eac60' : '#a6a6a6', width: 14, textAlign: 'center' }}
                      >
                        {req.met ? '✓' : '○'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: req.met ? '#1c1c1c' : '#a6a6a6' }}>
                        {req.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Confirm Password */}
                <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1c1c1c', mb: 0.75 }}>
                  Confirm New Password
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Re-enter new password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  error={passwordMismatch}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ fontSize: 15, color: '#a6a6a6' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowConfirm((v) => !v)} edge="end">
                            {showConfirm
                              ? <VisibilityOffOutlinedIcon sx={{ fontSize: 16, color: '#a6a6a6' }} />
                              : <VisibilityOutlinedIcon sx={{ fontSize: 16, color: '#a6a6a6' }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: '#f7f7f7', borderRadius: '10px', height: '46px',
                        '& fieldset': { borderColor: passwordMismatch ? '#e53935' : '#e1e1e1' },
                      },
                    },
                  }}
                  sx={{ mb: 1 }}
                />

                {passwordsMatch && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '4px', backgroundColor: '#1eac60' }} />
                    <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#1eac60' }}>
                      Passwords match
                    </Typography>
                  </Box>
                )}
                {passwordMismatch && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '4px', backgroundColor: '#e53935' }} />
                    <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#e53935' }}>
                      Passwords do not match
                    </Typography>
                  </Box>
                )}
                {!passwordsMatch && !passwordMismatch && <Box sx={{ mb: 2 }} />}

                {apiError && (
                  <Typography sx={{ fontSize: '0.8rem', color: '#c62828', mb: 2, textAlign: 'center' }}>
                    {apiError}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!passwordsMatch || strength < 2 || loading}
                  sx={{
                    backgroundColor: '#f75522',
                    '&:hover': { backgroundColor: '#d94419' },
                    '&:disabled': { backgroundColor: 'rgba(247,85,34,0.4)', color: '#fff' },
                    boxShadow: '0 4px 14px rgba(247, 85, 34, 0.35)',
                    borderRadius: '12px', height: '52px', fontSize: '15px', fontWeight: 700, mb: 2.5,
                  }}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component="button"
                    type="button"
                    underline="none"
                    onClick={() => navigate('/admin/login')}
                    sx={{
                      fontSize: '14px', color: '#f75522', fontWeight: 600,
                      display: 'inline-flex', alignItems: 'center', gap: 0.5,
                      '&:hover': { opacity: 0.8 },
                    }}
                  >
                    <ArrowBack sx={{ fontSize: 14 }} />
                    Back to Sign In
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        <Typography sx={{ mt: 3, fontSize: '12px', color: '#a6a6a6' }}>
          © 2026 Transpport. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default ResetPassword;
