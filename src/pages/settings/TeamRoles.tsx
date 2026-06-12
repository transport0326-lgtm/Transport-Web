import React from 'react';
import {
  Box, Typography, Button, Chip, Avatar,
  Table, TableHead, TableRow, TableCell, TableBody, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Member {
  initials: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

interface RolePermission {
  role: string;
  description: string;
}

const members: Member[] = [
  { initials: 'RK', name: 'Rajesh Kumar',  email: 'rajesh@transpport.in', role: 'Super Admin',      status: 'Active',   lastActive: 'Just now'  },
  { initials: 'PS', name: 'Priya Sharma',  email: 'priya@transpport.in',  role: 'Admin',            status: 'Active',   lastActive: '2 hrs ago' },
  { initials: 'AS', name: 'Amit Singh',    email: 'amit@transpport.in',   role: 'Operations Mgr',   status: 'Active',   lastActive: '1 hr ago'  },
  { initials: 'NG', name: 'Neha Gupta',    email: 'neha@transpport.in',   role: 'Support Lead',     status: 'Active',   lastActive: '30 min ago'},
  { initials: 'VP', name: 'Vikram Patel',  email: 'vikram@transpport.in', role: 'Fleet Manager',    status: 'Active',   lastActive: '3 hrs ago' },
  { initials: 'SD', name: 'Sunita Das',    email: 'sunita@transpport.in', role: 'Finance',          status: 'Inactive', lastActive: '2 days ago'},
  { initials: 'MA', name: 'Mohammad Ali', email: 'ali@transpport.in',    role: 'Support Agent',    status: 'Active',   lastActive: '15 min ago'},
];

const rolePermissions: RolePermission[] = [
  { role: 'Super Admin',        description: 'Full access to all features'                    },
  { role: 'Admin',              description: 'All features except billing & API'              },
  { role: 'Operations Manager', description: 'Orders, Partners, tracking'                      },
  { role: 'Support Lead',       description: 'Orders, customer issues, chat'                  },
  { role: 'Fleet Manager',      description: 'Partners, vehicles, documents'                    },
  { role: 'Finance',            description: 'Earnings, payouts, billing'                     },
  { role: 'Support Agent',      description: 'View-only orders, respond to issues'            },
];

const statusStyle = {
  Active:   { bgcolor: '#e8f5e9', color: '#2e7d32' },
  Inactive: { bgcolor: '#f0f0f0', color: '#757575' },
};

const TeamRoles: React.FC = () => (
  <Box>
    {/* Header */}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a2e' }}>
        Team &amp; Roles
      </Typography>
      <Button
        variant="contained"
        disableElevation
        startIcon={<AddIcon fontSize="small" />}
        sx={{
          bgcolor: '#E8490F',
          color: '#fff',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.82rem',
          borderRadius: 2,
          px: 2,
          py: 0.7,
          '&:hover': { bgcolor: '#c93d0c' },
        }}
      >
        + Invite Member
      </Button>
    </Box>

    {/* Members table */}
    <Box sx={{ border: '1px solid #f0f0f0', borderRadius: 2, overflow: 'hidden', mb: 3.5 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafafa' }}>
            {['Name', 'Email', 'Role', 'Status', 'Last Active', 'Action'].map((col) => (
              <TableCell
                key={col}
                sx={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 500, py: 1.2, px: 2, borderBottom: '1px solid #f0f0f0' }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.email} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#fafafa' } }}>
              {/* Name */}
              <TableCell sx={{ py: 1.4, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <Avatar sx={{ width: 30, height: 30, bgcolor: '#0D1B3E', fontSize: '0.68rem', fontWeight: 700 }}>
                    {m.initials}
                  </Avatar>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>
                    {m.name}
                  </Typography>
                </Box>
              </TableCell>

              {/* Email */}
              <TableCell sx={{ fontSize: '0.82rem', color: '#555', py: 1.4, px: 2 }}>{m.email}</TableCell>

              {/* Role */}
              <TableCell sx={{ py: 1.4, px: 2 }}>
                <Chip
                  label={m.role}
                  size="small"
                  sx={{
                    bgcolor: '#eef2ff',
                    color: '#3949ab',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    height: 22,
                    borderRadius: 1,
                  }}
                />
              </TableCell>

              {/* Status */}
              <TableCell sx={{ py: 1.4, px: 2 }}>
                <Chip
                  label={m.status}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    height: 22,
                    borderRadius: 1,
                    bgcolor: statusStyle[m.status].bgcolor,
                    color: statusStyle[m.status].color,
                  }}
                />
              </TableCell>

              {/* Last Active */}
              <TableCell sx={{ fontSize: '0.82rem', color: '#aaa', py: 1.4, px: 2 }}>{m.lastActive}</TableCell>

              {/* Action */}
              <TableCell sx={{ py: 1.4, px: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#ddd',
                    color: '#E8490F',
                    fontSize: '0.72rem',
                    textTransform: 'none',
                    borderRadius: 1.5,
                    px: 1.8,
                    py: 0.3,
                    minWidth: 0,
                    '&:hover': { borderColor: '#E8490F', bgcolor: '#fff5f2' },
                  }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>

    <Divider sx={{ mb: 3 }} />

    {/* Role Permissions */}
    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', mb: 1.5 }}>
      Role Permissions
    </Typography>

    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {rolePermissions.map((rp, idx, arr) => (
        <Box
          key={rp.role}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 1.3,
            borderBottom: idx < arr.length - 1 ? '1px solid #f5f5f5' : 'none',
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a2e', width: 180, flexShrink: 0 }}>
            {rp.role}
          </Typography>
          <Typography sx={{ flex: 1, fontSize: '0.82rem', color: '#888' }}>
            {rp.description}
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              color: '#E8490F',
              fontSize: '0.78rem',
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 0,
              px: 1,
              '&:hover': { bgcolor: '#fff5f2' },
            }}
          >
            Edit
          </Button>
        </Box>
      ))}
    </Box>
  </Box>
);

export default TeamRoles;
