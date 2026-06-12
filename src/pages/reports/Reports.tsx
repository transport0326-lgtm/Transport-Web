import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AdminLayout from "../../components/layout/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchReportsByDate } from "../../redux/sagas/reports/reportsByDateRangeAction";
import { exportReportExcel } from "../../redux/sagas/reports/exportReportPdfAction";
import { formatCurrency } from "../../utils/format";
import type { RootState } from "../../redux/stores/store";
import {
  getVehicleColor,
  resolveDateRange,
  stubDeliveries,
  toYMD,
  type GroupBy,
} from "./ReportsHelpers";
import ReportsStatCard from "./ReportsStatCard";
import ReportsDateRangePicker from "./ReportsDateRangePicker";
import ReportsCharts from "./ReportsCharts";
import ReportsTopRidersTable from "./ReportsTopRidersTable";

const Reports: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => state.reports);

  const todayYMD = toYMD(new Date());

  const [ridersPage, setRidersPage] = useState(0);
  const [ridersLimit, setRidersLimit] = useState(10);

  const [appliedFrom, setAppliedFrom] = useState(todayYMD);
  const [appliedTo, setAppliedTo] = useState(todayYMD);

  useEffect(() => {
    dispatch(fetchReportsByDate({ from: todayYMD, to: todayYMD }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = (from: string, to: string) => {
    setAppliedFrom(from);
    setAppliedTo(to);
    dispatch(fetchReportsByDate({ from, to }));
  };

  const handleRidersLimitChange = (newLimit: number) => {
    setRidersLimit(newLimit);
    setRidersPage(0);
  };

  const summary = data?.summary;
  const allTopRiders = data?.topRiders ?? [];
  const totalRiderPages = Math.ceil(allTopRiders.length / ridersLimit);
  const pagedRiders = allTopRiders.slice(
    ridersPage * ridersLimit,
    (ridersPage + 1) * ridersLimit,
  );

  const vehicleRevenueData = (data?.revenueByVehicleType ?? []).map((v) => ({
    name: v.vehicleType.charAt(0).toUpperCase() + v.vehicleType.slice(1),
    value: v.revenue,
    color: getVehicleColor(v.vehicleType),
  }));

  const fallbackRange = resolveDateRange("custom", new Date(), appliedFrom, appliedTo);
  const apiTrends = data?.trends;
  const resolvedRange = {
    ...fallbackRange,
    groupBy: (data?.filter?.groupBy ?? fallbackRange.groupBy) as GroupBy,
    message: fallbackRange.message,
  };
  const chartData =
    apiTrends && apiTrends.length
      ? apiTrends.map((t) => ({ label: t.label, deliveries: t.deliveries }))
      : (data?.filter?.labels ?? fallbackRange.labels).map((label, i) => ({
          label,
          deliveries: stubDeliveries(
            `${appliedFrom}-${resolvedRange.groupBy}-${i}-${label}`,
          ),
        }));

  return (
    <AdminLayout pageTitle="">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
          mt: -1,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "1.3rem", color: "#1a1a2e" }}>
          Reports &amp; Analytics
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ReportsDateRangePicker
            appliedFrom={appliedFrom}
            appliedTo={appliedTo}
            todayYMD={todayYMD}
            onApply={handleApply}
          />

          <Button
            variant="contained"
            disableElevation
            startIcon={<FileDownloadIcon fontSize="small" />}
            onClick={() =>
              dispatch(exportReportExcel({ from: appliedFrom, to: appliedTo }))
            }
            sx={{
              bgcolor: "#E8490F",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              borderRadius: 2,
              px: 2,
              py: 0.75,
              "&:hover": { bgcolor: "#c93d0c" },
            }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
        <ReportsStatCard
          label="Total Deliveries"
          value={summary?.totalDeliveries.current?.toString() ?? "—"}
          changePercent={summary?.totalDeliveries.changePercent}
          loading={loading}
        />
        <ReportsStatCard
          label="Total Revenue"
          value={
            summary?.totalRevenue.current != null
              ? formatCurrency(summary.totalRevenue.current)
              : "—"
          }
          changePercent={summary?.totalRevenue.changePercent}
          loading={loading}
        />
        <ReportsStatCard
          label="Avg Delivery Time"
          value={
            summary?.avgDeliveryMin.current != null
              ? `${summary.avgDeliveryMin.current} min`
              : "—"
          }
          changePercent={summary?.avgDeliveryMin.changePercent}
          loading={loading}
        />
        <ReportsStatCard
          label="Customer Rating"
          value={
            summary?.avgRating.current != null
              ? `${summary.avgRating.current} ★`
              : "—"
          }
          changePercent={summary?.avgRating.change}
          loading={loading}
        />
        <ReportsStatCard
          label="Active Riders"
          value={summary?.activeRiders.current?.toString() ?? "—"}
          changePercent={summary?.activeRiders.change}
          loading={loading}
        />
      </Box>

      <ReportsCharts
        loading={loading}
        chartData={chartData}
        groupBy={resolvedRange.groupBy}
        rangeMessage={resolvedRange.message}
        vehicleRevenueData={vehicleRevenueData}
      />

      <ReportsTopRidersTable
        loading={loading}
        allTopRiders={allTopRiders}
        pagedRiders={pagedRiders}
        page={ridersPage}
        totalPages={totalRiderPages}
        limit={ridersLimit}
        onPageChange={setRidersPage}
        onLimitChange={handleRidersLimitChange}
      />
    </AdminLayout>
  );
};

export default Reports;
