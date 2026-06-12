import React from 'react';
import {
  Box, Typography, Button, Chip, Divider,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: 'Paid' | 'Unpaid';
}

const invoices: Invoice[] = [
  { id: 'INV-2026-004', date: 'Apr 1, 2026', amount: '₹9,999', plan: 'Business Pro', status: 'Paid' },
  { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '₹9,999', plan: 'Business Pro', status: 'Paid' },
  { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: '₹9,999', plan: 'Business Pro', status: 'Paid' },
  { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: '₹9,999', plan: 'Business Pro', status: 'Paid' },
  { id: 'INV-2025-012', date: 'Dec 1, 2025', amount: '₹4,999', plan: 'Starter',      status: 'Paid' },
  { id: 'INV-2025-011', date: 'Nov 1, 2025', amount: '₹4,999', plan: 'Starter',      status: 'Paid' },
];

const BillingPlan: React.FC = () => (
  <Box>
    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a2e', mb: 2.5 }}>
      Billing &amp; Plan
    </Typography>

    {/* Current Plan Card */}
    <Box
      sx={{
        bgcolor: '#0D1B3E',
        borderRadius: 2.5,
        px: 3,
        py: 2.5,
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#fff', mb: 0.4 }}>
          Business Pro Plan
        </Typography>
        <Typography sx={{ fontSize: '0.95rem', color: '#aac4ff', fontWeight: 600, mb: 0.8 }}>
          ₹9,999/month
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', mb: 0.5 }}>
          Unlimited partners · Real-time tracking · API access · Priority support
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
          Renews on May 1, 2026
        </Typography>
      </Box>
      <Button
        variant="contained"
        disableElevation
        sx={{
          bgcolor: '#E8490F',
          color: '#fff',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.85rem',
          borderRadius: 2,
          px: 2.5,
          py: 0.9,
          flexShrink: 0,
          '&:hover': { bgcolor: '#c93d0c' },
        }}
      >
        Upgrade Plan
      </Button>
    </Box>

    {/* Payment Method */}
    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', mb: 1.5 }}>
      Payment Method
    </Typography>

    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        px: 2,
        py: 1.5,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40, height: 26, bgcolor: '#f0f0f0', borderRadius: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <CreditCardIcon sx={{ fontSize: 18, color: '#888' }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>
            Visa ending in 4242
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>Expires 12/2028</Typography>
        </Box>
      </Box>
      <Button
        size="small"
        sx={{
          color: '#E8490F',
          textTransform: 'none',
          fontSize: '0.82rem',
          fontWeight: 600,
          '&:hover': { bgcolor: '#fff5f2' },
        }}
      >
        Change →
      </Button>
    </Box>

    <Divider sx={{ mb: 3 }} />

    {/* Invoice History */}
    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', mb: 1.5 }}>
      Invoice History
    </Typography>

    <Box sx={{ border: '1px solid #f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafafa' }}>
            {['Invoice', 'Date', 'Amount', 'Plan', 'Status', 'Action'].map((col) => (
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
          {invoices.map((inv) => (
            <TableRow key={inv.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#fafafa' } }}>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.83rem', color: '#1a1a2e', py: 1.4, px: 2 }}>
                {inv.id}
              </TableCell>
              <TableCell sx={{ fontSize: '0.83rem', color: '#555', py: 1.4, px: 2 }}>{inv.date}</TableCell>
              <TableCell sx={{ fontSize: '0.83rem', fontWeight: 500, color: '#444', py: 1.4, px: 2 }}>
                {inv.amount}
              </TableCell>
              <TableCell sx={{ fontSize: '0.83rem', color: '#555', py: 1.4, px: 2 }}>{inv.plan}</TableCell>
              <TableCell sx={{ py: 1.4, px: 2 }}>
                <Chip
                  label={inv.status}
                  size="small"
                  sx={{
                    bgcolor: '#e8f5e9', color: '#2e7d32',
                    fontSize: '0.7rem', fontWeight: 600, height: 22, borderRadius: 1,
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: 1.4, px: 2 }}>
                <Button
                  size="small"
                  startIcon={<FileDownloadIcon sx={{ fontSize: '14px !important' }} />}
                  sx={{
                    color: '#E8490F',
                    fontSize: '0.78rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 0,
                    minWidth: 0,
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                  }}
                >
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </Box>
);

export default BillingPlan;
