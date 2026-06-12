import React from "react";
import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../utils/format";
import type { GroupBy } from "./ReportsHelpers";

interface ChartPoint {
  label: string;
  deliveries: number;
}

interface VehicleRevenuePoint {
  name: string;
  value: number;
  color: string;
}

interface ReportsChartsProps {
  loading: boolean;
  chartData: ChartPoint[];
  groupBy: GroupBy;
  rangeMessage?: string;
  vehicleRevenueData: VehicleRevenuePoint[];
}

const ReportsCharts: React.FC<ReportsChartsProps> = ({
  loading,
  chartData,
  groupBy,
  rangeMessage,
  vehicleRevenueData,
}) => (
  <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
    <Card elevation={0} sx={{ border: "1px solid #eee", borderRadius: 2, flex: 1.4 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", mb: 2 }}>
          Delivery Trends
        </Typography>
        {loading ? (
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
        ) : groupBy === "error" ? (
          <Box
            sx={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography sx={{ fontSize: "0.85rem", color: "#888" }}>
              {rangeMessage}
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              barSize={56}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#bbb" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#bbb" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #eee",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="deliveries" fill="#E8490F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>

    <Card elevation={0} sx={{ border: "1px solid #eee", borderRadius: 2, flex: 1 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", mb: 1 }}>
          Revenue by Vehicle Type
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Skeleton variant="circular" width={144} height={144} />
            <Box sx={{ flex: 1 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={20} sx={{ mb: 0.5 }} />
              ))}
            </Box>
          </Box>
        ) : vehicleRevenueData.length === 0 ? (
          <Typography sx={{ fontSize: "0.8rem", color: "#aaa", mt: 2 }}>
            No data available
          </Typography>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={vehicleRevenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {vehicleRevenueData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {vehicleRevenueData.map((v) => (
                <Box key={v.name} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: v.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: "0.75rem", color: "#444" }}>
                    {v.name} – {formatCurrency(v.value)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  </Box>
);

export default ReportsCharts;
