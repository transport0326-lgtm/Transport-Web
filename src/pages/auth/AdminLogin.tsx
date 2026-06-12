import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/sagas/auth/loginSagaAction';
import type { RootState } from '../../redux/stores/store';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error: loginError } = useSelector((state: RootState) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data?.success) {
      sessionStorage.setItem('session_active', 'true');
      navigate('/dashboard');
    }
  }, [data, navigate]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    dispatch(login({ email, password }));
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
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(232, 73, 15, 0.06)',
            top: -100,
            left: -100,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(232, 73, 15, 0.05)',
            bottom: -80,
            right: -80,
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 3, zIndex: 1 }}>
          <Box
            component="img"
            src="/logo.png?v=2"
            alt="Transpport"
            sx={{ width: 200, objectFit: 'contain' }}
          />
        </Box>

        {/* Tagline */}
        <Box sx={{ textAlign: 'center', zIndex: 1, px: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.8rem',
              mb: 1,
            }}
          >
            You Are Transpport.
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: 0.5,
              mb: 0.5,
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.8rem',
            }}
          >
            Manage your fleet, bookings, and partners
          </Typography>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#f0f2f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: 400,
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}
            >
              Admin Login
            </Typography>
            <Typography
              sx={{ color: '#8a8a9a', fontSize: '0.85rem', mb: 3 }}
            >
              Sign in to your admin dashboard
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Email */}
              <Typography
                sx={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#444',
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

              {/* Password */}
              <Typography
                sx={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#444',
                  mb: 0.5,
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                type={showPassword ? 'text' : 'password'}
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
                sx={{ mb: 1.5 }}
              />

              {/* Remember Me & Forgot Password */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#ccc',
                        '&.Mui-checked': { color: '#E8490F' },
                        p: 0.5,
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.82rem', color: '#666' }}>
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={() => navigate('/admin/forgot-password')}
                  sx={{
                    fontSize: '0.82rem',
                    color: '#E8490F',
                    fontWeight: 500,
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              {/* Error message */}
              {(error || loginError) && (
                <Typography sx={{ fontSize: '0.8rem', color: '#c62828', mb: 2, textAlign: 'center' }}>
                  {error || loginError}
                </Typography>
              )}

              {/* Sign In Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: '#E8490F',
                  '&:hover': { backgroundColor: '#c93d0c' },
                  boxShadow: '0 4px 14px rgba(232, 73, 15, 0.35)',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography
          sx={{
            mt: 3,
            fontSize: '0.75rem',
            color: '#aaa',
          }}
        >
          © 2026 Transpport. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminLogin;
