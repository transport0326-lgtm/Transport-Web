import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import GppGoodIcon from "@mui/icons-material/GppGood";
import AdminLayout from "../../components/layout/AdminLayout";
import CreateZoneModal from "../../components/modals/CreateZoneModal";
import RejectRiderModal from "../../components/modals/RejectRiderModal";
import SuspendRiderModal from "../../components/modals/SuspendRiderModal";
import DeleteConfirmModal from "../../components/modals/DeleteConfirmModal";
import { fetchRiderDetail } from "../../redux/sagas/riderManagement/fetchRiderDetailAction";
import { approveRider } from "../../redux/sagas/riderManagement/approveRiderAction";
import { unsuspendRider } from "../../redux/sagas/riderManagement/unsuspendRiderAction";
import {
  resetApprove,
  resetSuspend,
  resetUnsuspend,
} from "../../redux/slices/riderManagementSlice";
import { fetchZoneSettings } from "../../redux/sagas/serviceZones/zoneSettingsAction";
import { assignRiderZone } from "../../redux/sagas/serviceZones/assignRiderZoneAction";
import type { RootState } from "../../redux/stores/store";
import { capitalizeVehicle } from "../../utils/vehicle";
import { formatDate, type DocItem } from "./RiderProfileHelpers";
import DocSection from "./RiderProfileDocSection";
import RiderProfileSuspendedView from "./RiderProfileSuspendedView";
import RiderProfileSidebar from "./RiderProfileSidebar";
import RiderProfileZoneManagement from "./RiderProfileZoneManagement";
import RiderProfileCustomerFeedback from "./RiderProfileCustomerFeedback";
import RiderProfileRecentTrips from "./RiderProfileRecentTrips";

const RiderProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.riderDetail,
  );
  const {
    approveLoading,
    approveSuccess,
    suspendSuccess,
    unsuspendLoading,
    unsuspendSuccess,
    unsuspendError,
  } = useSelector((state: RootState) => state.riderManagement);
  const { data: zoneData } = useSelector(
    (state: RootState) => state.zoneSettings,
  );

  const [addZone, setAddZone] = useState("");
  const [createZoneOpen, setCreateZoneOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripsPage, setTripsPage] = useState(0);
  const [tripsLimit, setTripsLimit] = useState(10);

  useEffect(() => {
    if (id) dispatch(fetchRiderDetail({ riderId: id }));
  }, [id, dispatch]);

  useEffect(() => {
    if (approveSuccess) {
      dispatch(resetApprove());
      navigate("/riders");
    }
  }, [approveSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchZoneSettings());
  }, [dispatch]);

  useEffect(() => {
    if (suspendSuccess) {
      dispatch(resetSuspend());
      if (id) dispatch(fetchRiderDetail({ riderId: id }));
    }
  }, [suspendSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (unsuspendSuccess) {
      dispatch(resetUnsuspend());
      if (id) dispatch(fetchRiderDetail({ riderId: id }));
    }
  }, [unsuspendSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUnsuspendRider = () => {
    if (id) dispatch(unsuspendRider({ riderId: id }));
  };

  const handleApproveRider = () => {
    if (id) dispatch(approveRider({ riderId: id }));
  };

  if (loading)
    return (
      <AdminLayout pageTitle="Partner Profile">
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "#9ca3af",
            fontSize: "0.9rem",
          }}
        >
          Loading...
        </Box>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout pageTitle="Partner Profile">
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "#dc2626",
            fontSize: "0.9rem",
          }}
        >
          Error: {error}
        </Box>
      </AdminLayout>
    );

  if (!data) return null;

  const { rider, stats, documents, recentTrips, zone, customerFeedback } = data;

  const zoneLabel = zone?.name
    ? zone.city
      ? `${zone.name} — ${zone.city}`
      : zone.name
    : "—";

  const canApproveRider =
    documents.dl.status === "approved" &&
    documents.rc.status === "approved" &&
    Boolean(zone?._id);

  const isApproved = rider.isProfileComplete && !rider.isSuspended;

  const vehicleLabel = `${capitalizeVehicle(rider.vehicleType)}${rider.vehicleNumber ? ` - ${rider.vehicleNumber}` : ""}`;
  const bankLabel = rider.bankAccount.bankName
    ? `${rider.bankAccount.bankName}${rider.bankAccount.accountNumber ? ` - XXXX ${rider.bankAccount.accountNumber.slice(-4)}` : ""}`
    : "—";
  const submittedDate = formatDate(rider.createdAt);

  const docItems: DocItem[] = [
    {
      key: "dl",
      type: "Driving License (DL)",
      required: true,
      status: documents.dl.status,
      number: documents.dl.number || "—",
      submitted: submittedDate,
      url: documents.dl.url,
    },
    {
      key: "rc",
      type: "RC Card",
      required: true,
      status: documents.rc.status,
      number: documents.rc.number || "—",
      submitted: submittedDate,
      url: documents.rc.url,
    },
  ];

  const statusChips = [
    rider.isSuspended
      ? {
          label: "Suspended",
          bg: "#fef2f2",
          color: "#dc2626",
          border: "#fecaca",
        }
      : {
          label: rider.isProfileComplete ? "Approved" : "Pending Approval",
          bg: rider.isProfileComplete ? "#f0fdf4" : "#fffbeb",
          color: rider.isProfileComplete ? "#16a34a" : "#d97706",
          border: rider.isProfileComplete ? "#bbf7d0" : "#fde68a",
        },
    rider.hasDL
      ? { label: "DL ✓", bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" }
      : {
          label: "DL Missing",
          bg: "#fef2f2",
          color: "#dc2626",
          border: "#fecaca",
        },
    rider.hasRC
      ? { label: "RC ✓", bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" }
      : {
          label: "RC Missing",
          bg: "#fef2f2",
          color: "#dc2626",
          border: "#fecaca",
        },
  ];

  if (rider.isSuspended) {
    return (
      <RiderProfileSuspendedView
        rider={rider}
        stats={stats}
        vehicleLabel={vehicleLabel}
        zoneLabel={zoneLabel}
        unsuspendLoading={unsuspendLoading}
        unsuspendError={unsuspendError}
        onUnsuspend={handleUnsuspendRider}
      />
    );
  }

  return (
    <AdminLayout
      pageTitle="Partner Profile"
      breadcrumbs={[
        { label: "Partner Management", path: "/riders" },
        { label: rider.name },
      ]}
    >
      {/* ─── Page heading + actions ─── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 1.2,
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: "1.4rem", fontWeight: 700, color: "#111827", mb: 0.7, lineHeight: 1.2 }}
          >
            Partner Profile
          </Typography>
          <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap", alignItems: "center" }}>
            {statusChips.map((s) => (
              <Chip
                key={s.label}
                label={s.label}
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  height: 22,
                  bgcolor: s.bg,
                  color: s.color,
                  border: `1px solid ${s.border}`,
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexShrink: 0, ml: 2, mt: 0.5 }}>
          <Button
            size="small"
            disabled={isApproved}
            startIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
            onClick={() => setRejectModalOpen(true)}
            sx={{
              fontSize: "0.78rem",
              fontWeight: 600,
              textTransform: "none",
              color: "#dc2626",
              border: "1px solid #fca5a5",
              borderRadius: 2,
              px: 1.8,
              "&:hover": { borderColor: "#dc2626", bgcolor: "#fef2f2" },
              "&.Mui-disabled": {
                color: "#fca5a5",
                borderColor: "#fee2e2",
              },
            }}
          >
            Reject Partner
          </Button>
          <Button
            size="small"
            variant="contained"
            disableElevation
            disabled={approveLoading || !canApproveRider}
            onClick={handleApproveRider}
            startIcon={<CheckIcon sx={{ fontSize: "14px !important" }} />}
            sx={{
              fontSize: "0.78rem",
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#16a34a",
              borderRadius: 2,
              px: 1.8,
              "&:hover": { bgcolor: "#15803d" },
              "&.Mui-disabled": { bgcolor: "#86efac", color: "#fff" },
            }}
          >
            {approveLoading ? "Approving..." : "Approve Partner"}
          </Button>
        </Box>
      </Box>

      {/* ─── Approval requirements banner ─── */}
      {!isApproved && (() => {
        const pending: string[] = [];
        if (documents.dl.status !== "approved") pending.push("Approve Driving License (DL)");
        if (documents.rc.status !== "approved") pending.push("Approve RC Card");
        if (!zone?._id) pending.push("Assign a service zone");

        const allMet = pending.length === 0;
        const bg = allMet ? "#f0fdf4" : "#fffbeb";
        const border = allMet ? "#bbf7d0" : "#fde68a";
        const iconColor = allMet ? "#16a34a" : "#d97706";
        const textColor = allMet ? "#166534" : "#92400e";

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              bgcolor: bg,
              border: `1px solid ${border}`,
              borderRadius: 2,
              px: 2,
              py: 1,
              mb: 2.5,
            }}
          >
            {allMet ? (
              <GppGoodIcon sx={{ fontSize: 16, color: iconColor, flexShrink: 0, mt: "2px" }} />
            ) : (
              <WarningAmberIcon sx={{ fontSize: 16, color: iconColor, flexShrink: 0, mt: "2px" }} />
            )}
            <Box>
              {allMet ? (
                <Typography sx={{ fontSize: "0.8rem", color: textColor }}>
                  <strong>All requirements met.</strong>&nbsp;Click <em>Approve Partner</em> to complete onboarding.
                </Typography>
              ) : (
                <>
                  <Typography sx={{ fontSize: "0.8rem", color: textColor, fontWeight: 600, mb: 0.4 }}>
                    Complete the following to approve this partner:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.2, color: textColor }}>
                    {pending.map((item) => (
                      <Box
                        component="li"
                        key={item}
                        sx={{ fontSize: "0.78rem", lineHeight: 1.6 }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        );
      })()}

      {/* ─── 3-column layout ─── */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
          mb: 2.5,
          height: "calc(100vh - 220px)",
          minHeight: 520,
        }}
      >
        <RiderProfileSidebar
          rider={rider}
          stats={stats}
          vehicleLabel={vehicleLabel}
          zoneLabel={zoneLabel}
          bankLabel={bankLabel}
        />

        {/* MIDDLE ── Document Verification */}
        <Box
          sx={{
            flex: 3,
            height: "100%",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "#d1d5db", borderRadius: 4 },
            "&::-webkit-scrollbar-thumb:hover": { bgcolor: "#9ca3af" },
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2.5,
                py: 1.6,
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <GppGoodIcon sx={{ fontSize: 18, color: "#E8490F" }} />
                <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827" }}>
                  Document Verification
                </Typography>
              </Box>
              <Chip
                label="DL + RC required for approval"
                size="small"
                sx={{
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  height: 20,
                  bgcolor: "#fff7ed",
                  color: "#ea580c",
                  border: "1px solid #fed7aa",
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            </Box>

            {docItems.map((doc, i) => (
              <Fragment key={doc.key}>
                {i > 0 && <Box sx={{ borderTop: "1px solid #f3f4f6" }} />}
                <DocSection doc={doc} riderId={id ?? ""} />
              </Fragment>
            ))}
          </Box>
        </Box>

        {/* RIGHT ── Zone Management + Customer Feedback */}
        <Box
          sx={{
            flex: 2,
            height: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "#d1d5db", borderRadius: 4 },
            "&::-webkit-scrollbar-thumb:hover": { bgcolor: "#9ca3af" },
            pb: 1,
          }}
        >
          <RiderProfileZoneManagement
            rider={rider}
            zone={zone}
            zoneLabel={zoneLabel}
            zoneOptions={(zoneData?.zones ?? []).map((z) => ({
              _id: z._id,
              name: z.name,
              city: z.city,
            }))}
            addZone={addZone}
            setAddZone={setAddZone}
            onAssignZone={() => {
              if (!addZone || !id) return;
              dispatch(assignRiderZone({ riderId: id, zoneId: addZone }));
            }}
            onCreateZoneClick={() => setCreateZoneOpen(true)}
            onSuspendClick={() => setSuspendModalOpen(true)}
            onDeleteClick={() => setDeleteModalOpen(true)}
          />

          {customerFeedback && (
            <RiderProfileCustomerFeedback customerFeedback={customerFeedback} />
          )}
        </Box>
      </Box>

      {/* ─── Recent Trips (full width) ─── */}
      <RiderProfileRecentTrips
        recentTrips={recentTrips}
        page={tripsPage}
        limit={tripsLimit}
        onPageChange={setTripsPage}
        onLimitChange={(newLimit) => {
          setTripsLimit(newLimit);
          setTripsPage(0);
        }}
      />

      <CreateZoneModal
        open={createZoneOpen}
        onClose={() => setCreateZoneOpen(false)}
        riderName={rider.name}
        riderId={rider._id}
      />
      <SuspendRiderModal
        open={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        riderId={rider._id}
        riderName={rider.name}
        vehicleType={rider.vehicleType}
        zone={zone?.name ?? null}
        trips={stats.trips}
        avgRating={stats.avgRating}
      />
      <RejectRiderModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        riderId={rider._id}
        riderName={rider.name}
        vehicleType={rider.vehicleType}
        zone={zone?.name ?? null}
        appliedDate={rider.createdAt}
      />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        riderName={rider.name}
        riderId={rider._id}
      />
    </AdminLayout>
  );
};

export default RiderProfile;
