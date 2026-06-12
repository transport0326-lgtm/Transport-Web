import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Chip, CircularProgress,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TimerIcon from '@mui/icons-material/Timer';
import AdminLayout from '../../components/layout/AdminLayout';
import TablePagination from '../../components/common/TablePagination';
import { timeAgo } from '../../utils/format';
import { fetchDashboard } from '../../redux/sagas/dashboard/dashboardSagaAction';
import type { RootState } from '../../redux/stores/store';
import type { LiveActivityItem, RecentOrder } from '../../redux/slices/dashboardSlice';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STATUS_MAP: Record<string, { label: string; bgcolor: string; color: string }> = {
  assigned:         { label: 'Assigned',    bgcolor: '#ede7f6', color: '#7e57c2' },
  in_transit:       { label: 'In Transit',  bgcolor: '#e3f2fd', color: '#1976d2' },
  arrived_at_pickup:{ label: 'Arrived',     bgcolor: '#fff3e0', color: '#ef6c00' },
  completed:        { label: 'Delivered',   bgcolor: '#e8f5e9', color: '#2e7d32' },
  cancelled:        { label: 'Cancelled',   bgcolor: '#ffebee', color: '#c62828' },
};

const ACTIVITY_COLOR: Record<string, string> = {
  completed:         '#4caf50',
  cancelled:         '#f44336',
  assigned:          '#7e57c2',
  arrived_at_pickup: '#2196f3',
  in_transit:        '#2196f3',
};

const activityText = (item: LiveActivityItem) => {
  switch (item.status) {
    case 'assigned':          return `${item.bookingNumber} assigned to partner`;
    case 'cancelled':         return `${item.bookingNumber} cancelled`;
    case 'completed':         return `${item.bookingNumber} delivered successfully`;
    case 'arrived_at_pickup': return `${item.bookingNumber} arrived at pickup`;
    case 'in_transit':        return `${item.bookingNumber} picked up`;
    default: return `${item.bookingNumber} ${item.status.replace(/_/g, ' ')}`;
  }
};


const shortAddr = (addr: string) => addr.split(',')[0].trim();

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  subColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, subColor = '#4caf50' }) => (
  <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2, flex: 1 }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ color: '#aaa', display: 'flex' }}>{icon}</Box>
        <Typography sx={{ fontSize: '0.78rem', color: '#aaa' }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', color: subColor, mt: 0.5, fontWeight: 500 }}>
        {sub}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => state.dashboard);
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersLimit, setOrdersLimit] = useState(10);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const todayIndex = (new Date().getDay() + 6) % 7; // Mon=0 … Sun=6

  const weeklyData = (data?.deliveriesThisWeek ?? Array(7).fill(0)).map((count, i) => ({
    day: WEEK_DAYS[i],
    deliveries: count,
  }));

  const allOrders = data?.recentOrders ?? [];
  const totalOrderPages = Math.ceil(allOrders.length / ordersLimit);
  const pagedOrders = allOrders.slice(ordersPage * ordersLimit, (ordersPage + 1) * ordersLimit);

  const handleOrdersLimitChange = (newLimit: number) => {
    setOrdersLimit(newLimit);
    setOrdersPage(0);
  };

  return (
    <AdminLayout pageTitle="Dashboard">

      {loading && !data && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#E8490F' }} />
        </Box>
      )}

      {(!loading || data) && (
        <>
          {/* Stat Cards */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <StatCard
              icon={<ShoppingCartIcon fontSize="small" />}
              label="Today's Orders"
              value={data ? String(data.todayOrders) : '—'}
              sub="Total orders today"
            />
            <StatCard
              icon={<TwoWheelerIcon fontSize="small" />}
              label="Active Partners"
              value={data ? String(data.activeRiders) : '—'}
              sub="Currently online"
              subColor="#888"
            />
            <StatCard
              icon={<CurrencyRupeeIcon fontSize="small" />}
              label="Today's Revenue"
              value={data ? `₹${data.todayRevenue.toLocaleString('en-IN')}` : '—'}
              sub="Revenue today"
            />
            <StatCard
              icon={<TimerIcon fontSize="small" />}
              label="Avg Delivery"
              value={data ? `${data.avgDeliveryMin} min` : '—'}
              sub="Average delivery time"
              subColor="#888"
            />
          </Box>

          {/* Chart + Live Activity */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2, flex: 1.6 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', mb: 2 }}>
                  Deliveries This Week
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData} barSize={32} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#bbb' }} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 12 }} />
                    <Bar
                      dataKey="deliveries"
                      radius={[4, 4, 0, 0]}
                      shape={(props: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                        const { x, y, width, height, index } = props;
                        return (
                          <rect
                            x={x} y={y} width={width} height={height}
                            fill={index === todayIndex ? '#E8490F' : '#c5cae9'}
                            rx={4} ry={4}
                          />
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2, flex: 1 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f44336' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e' }}>Live Activity</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 220, overflowY: 'auto', pr: 0.5 }}>
                  {(data?.liveActivity ?? []).map((item: LiveActivityItem) => (
                    <Box key={item.bookingNumber + item.updatedAt} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: ACTIVITY_COLOR[item.status] ?? '#aaa', mt: 0.6, flexShrink: 0 }} />
                      <Typography sx={{ flex: 1, fontSize: '0.78rem', color: '#333' }}>{activityText(item)}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#bbb', whiteSpace: 'nowrap' }}>{timeAgo(item.updatedAt)}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Recent Orders */}
          <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Order ID', 'Route', 'Vehicle', 'Amount', 'Status', 'Time'].map((col) => (
                      <TableCell key={col} sx={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 500, borderBottom: '1px solid #f0f0f0', py: 1 }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedOrders.map((row: RecentOrder) => {
                    const statusInfo = STATUS_MAP[row.status] ?? { label: row.status, bgcolor: '#eee', color: '#333' };
                    return (
                      <TableRow key={row.bookingNumber} sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#1a1a2e', py: 1.2 }}>{row.bookingNumber}</TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', color: '#444', py: 1.2, maxWidth: 200 }}>
                          <Typography noWrap sx={{ fontSize: '0.82rem', color: '#444' }}>
                            {shortAddr(row.pickup)} → {shortAddr(row.dropoff)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', color: '#666', py: 1.2, textTransform: 'capitalize' }}>{row.vehicleType}</TableCell>
                        <TableCell sx={{ fontSize: '0.82rem', fontWeight: 500, color: '#444', py: 1.2 }}>₹{row.amount}</TableCell>
                        <TableCell sx={{ py: 1.2 }}>
                          <Chip
                            label={statusInfo.label}
                            size="small"
                            sx={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              height: 22,
                              borderRadius: 1,
                              bgcolor: statusInfo.bgcolor,
                              color: statusInfo.color,
                            }}
                          />
                          {row.cancelledBy && (
                            <Typography sx={{ fontSize: '0.68rem', color: '#aaa', mt: 0.3, lineHeight: 1 }}>
                              by {row.cancelledBy === 'rider' ? 'Partner' : 'Customer'}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.78rem', color: '#aaa', py: 1.2 }}>{timeAgo(row.createdAt)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Box sx={{ pt: 1.5, borderTop: '1px solid #f5f5f5' }}>
                <TablePagination
                  page={ordersPage + 1}
                  totalPages={totalOrderPages}
                  limit={ordersLimit}
                  onPageChange={(p) => setOrdersPage(p - 1)}
                  onLimitChange={handleOrdersLimitChange}
                />
              </Box>
            </CardContent>
          </Card>
        </>
      )}

    </AdminLayout>
  );
};

export default Dashboard;
