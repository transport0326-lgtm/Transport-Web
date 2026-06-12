import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../redux/sagas/auth/forgotPasswordSagaAction';
import { clearForgotPassword } from '../../redux/slices/forgotPasswordSlice';
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
} from '@mui/material';
import { EmailOutlined, ArrowBack } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, loading, error: apiError } = useSelector((state: RootState) => state.forgotPassword);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    dispatch(forgotPassword({ email }));
  };

  const handleResend = () => {
    dispatch(clearForgotPassword());
    dispatch(forgotPassword({ email }));
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
        <Box sx={{ mb: 3, zIndex: 1 }}>
          <Box
            component="img"
            src="/logo.png?v=2"
            alt="Transpport"
            sx={{ width: 200, objectFit: 'contain' }}
          />
        </Box>
        <Box sx={{ textAlign: 'center', zIndex: 1, px: 4 }}>
          <Typography
            variant="h4"
            sx={{ color: '#fff', fontWeight: 700, fontSize: '1.8rem', mb: 1 }}
          >
            You Are Transpport.
          </Typography>
          <Typography
            sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: 0.5, mb: 0.5 }}
          >
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
        {success ? (
          /* Email Sent Confirmation Card */
          <Card
            elevation={0}
            sx={{
              width: 420,
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ p: '36px', textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(30, 172, 96, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2.5,
                }}
              >
                <CheckIcon sx={{ fontSize: 36, color: '#1eac60' }} />
              </Box>

              <Typography sx={{ fontWeight: 700, color: '#1c1c1c', fontSize: '22px', mb: 1 }}>
                Check Your Email!
              </Typography>
              <Typography sx={{ color: '#737373', fontSize: '13px', lineHeight: 1.6, mb: 3 }}>
                We've sent a password reset link to<br />
                <strong style={{ color: '#1c1c1c' }}>{email}</strong>
              </Typography>

              <Box
                sx={{
                  backgroundColor: 'rgba(247, 85, 34, 0.06)',
                  borderRadius: '10px',
                  px: 2,
                  py: 1.5,
                  mb: 2.5,
                  textAlign: 'left',
                }}
              >
                <Typography sx={{ fontSize: '12px', color: '#99330d', lineHeight: 1.6 }}>
                  💡&nbsp; The link will expire in 30 minutes. Check your spam folder if you don't see it.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, mb: 2.5 }}>
                <Typography sx={{ fontSize: '13px', color: '#737373' }}>
                  Didn't receive it?
                </Typography>
                <Link
                  component="button"
                  underline="none"
                  onClick={handleResend}
                  sx={{ fontSize: '13px', fontWeight: 600, color: '#f75522', '&:hover': { opacity: 0.8 } }}
                >
                  Resend Email
                </Link>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/admin/login')}
                sx={{
                  borderColor: '#e1e1e1',
                  color: '#1c1c1c',
                  borderRadius: '12px',
                  height: '52px',
                  fontSize: '15px',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#c1c1c1', backgroundColor: 'rgba(0,0,0,0.02)' },
                }}
              >
                <ArrowBack sx={{ fontSize: 16, mr: 0.5 }} />
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Forgot Password Form Card */
          <Card
            elevation={0}
            sx={{
              width: 420,
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ p: '36px', textAlign: 'center' }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '36px',
                  backgroundColor: 'rgba(247, 85, 34, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: 28,
                }}
              >
                🔒
              </Box>

              <Typography sx={{ fontWeight: 700, color: '#1c1c1c', fontSize: '22px', mb: 1 }}>
                Forgot Password?
              </Typography>
              <Typography sx={{ color: '#737373', fontSize: '13px', mb: 3, lineHeight: 1.6 }}>
                No worries! Enter your email address and we'll send you a link to reset your password.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1c1c1c', mb: 0.75 }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="admin@transpport.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <EmailOutlined sx={{ fontSize: 16, color: '#a6a6a6' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: '#f7f7f7',
                        borderRadius: '10px',
                        height: '48px',
                        '& fieldset': { borderColor: '#e1e1e1' },
                      },
                    },
                  }}
                  sx={{ mb: 2.5 }}
                />

                {(error || apiError) && (
                  <Typography sx={{ fontSize: '0.8rem', color: '#c62828', mb: 2, textAlign: 'center' }}>
                    {error || apiError}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: '#f75522',
                    '&:hover': { backgroundColor: '#d94419' },
                    boxShadow: '0 4px 14px rgba(247, 85, 34, 0.35)',
                    borderRadius: '12px',
                    height: '52px',
                    fontSize: '15px',
                    fontWeight: 700,
                    mb: 2.5,
                  }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e1e1e1' }} />
                  <Typography sx={{ fontSize: '12px', color: '#a6a6a6' }}>or</Typography>
                  <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e1e1e1' }} />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component="button"
                    type="button"
                    underline="none"
                    onClick={() => navigate('/admin/login')}
                    sx={{
                      fontSize: '14px',
                      color: '#f75522',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
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

export default ForgotPassword;
