import React, { useState } from 'react';
import {
  Box, Typography, TextField, Switch, Button, Divider, Chip,
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

interface Session {
  browser: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

const sessions: Session[] = [
  { browser: 'Chrome on Windows', ip: '192.168.1.45', lastActive: 'Active now',  current: true  },
  { browser: 'Safari on iPhone',  ip: '192.168.1.82', lastActive: '2 hours ago', current: false },
  { browser: 'Firefox on MacOS',  ip: '10.0.0.15',    lastActive: 'Yesterday',   current: false },
];

const securityToggles = [
  { label: 'Auto-logout after inactivity', description: '30 minutes',  defaultOn: true  },
  { label: 'Login email notifications',    description: 'Enabled',     defaultOn: true  },
  { label: 'IP address restriction',       description: 'Disabled',    defaultOn: false },
];

const switchSx = {
  '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#4caf50' },
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    fontSize: '0.85rem',
    bgcolor: '#fafafa',
    '& fieldset': { borderColor: '#e0e0e0' },
    '&:hover fieldset': { borderColor: '#bbb' },
    '&.Mui-focused fieldset': { borderColor: '#0D1B3E' },
  },
  '& .MuiInputLabel-root': { fontSize: '0.78rem', color: '#aaa' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#0D1B3E' },
};

const Security: React.FC = () => {
  const [twoFA, setTwoFA] = useState(true);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    () => Object.fromEntries(securityToggles.map((t) => [t.label, t.defaultOn])),
  );

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a2e', mb: 2.5 }}>
        Security
      </Typography>

      {/* Password & Authentication */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', mb: 2 }}>
        Password &amp; Authentication
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: '0.78rem', color: '#aaa', mb: 0.6 }}>Current Password</Typography>
          <TextField
            type="password"
            defaultValue="password"
            fullWidth
            size="small"
            sx={inputSx}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.78rem', color: '#aaa', mb: 0.6 }}>New Password</Typography>
          <TextField type="password" fullWidth size="small" sx={inputSx} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.78rem', color: '#aaa', mb: 0.6 }}>Confirm New Password</Typography>
          <TextField type="password" fullWidth size="small" sx={inputSx} />
        </Box>
      </Box>

      <Button
        variant="contained"
        disableElevation
        sx={{
          bgcolor: '#0D1B3E',
          color: '#fff',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.85rem',
          borderRadius: 2,
          px: 3,
          mb: 3.5,
          '&:hover': { bgcolor: '#162b5e' },
        }}
      >
        Update Password
      </Button>

      <Divider sx={{ mb: 3 }} />

      {/* Two-Factor Authentication */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', mb: 0.4 }}>
            Two-Factor Authentication (2FA)
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#aaa' }}>
            Add an extra layer of security to your account
          </Typography>
          {twoFA && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <TaskAltIcon sx={{ fontSize: 14, color: '#2e7d32' }} />
              <Typography sx={{ fontSize: '0.78rem', color: '#2e7d32', fontWeight: 500 }}>
                Enabled via Authenticator App
              </Typography>
            </Box>
          )}
        </Box>
        <Switch
          checked={twoFA}
          onChange={(e) => setTwoFA(e.target.checked)}
          sx={switchSx}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Active Sessions */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', mb: 1.5 }}>
        Active Sessions
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3.5 }}>
        {sessions.map((s, idx, arr) => (
          <Box
            key={s.browser}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1.4,
              borderBottom: idx < arr.length - 1 ? '1px solid #f5f5f5' : 'none',
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a2e', mb: 0.2 }}>
                {s.browser}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>
                IP: {s.ip} · {s.lastActive}
              </Typography>
            </Box>
            {s.current ? (
              <Chip
                label="Current"
                size="small"
                sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontSize: '0.7rem', fontWeight: 600, height: 22, borderRadius: 1 }}
              />
            ) : (
              <Button
                size="small"
                variant="outlined"
                sx={{
                  borderColor: '#ffcdd2',
                  color: '#c62828',
                  fontSize: '0.72rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1.5,
                  px: 1.8,
                  py: 0.3,
                  '&:hover': { borderColor: '#c62828', bgcolor: '#fff5f5' },
                }}
              >
                Revoke
              </Button>
            )}
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Security Settings */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', mb: 1.2 }}>
        Security Settings
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {securityToggles.map((item, idx, arr) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1.3,
              borderBottom: idx < arr.length - 1 ? '1px solid #f5f5f5' : 'none',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e', mb: 0.2 }}>
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>{item.description}</Typography>
            </Box>
            <Switch
              checked={toggleStates[item.label]}
              onChange={() =>
                setToggleStates((prev) => ({ ...prev, [item.label]: !prev[item.label] }))
              }
              sx={switchSx}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Security;
