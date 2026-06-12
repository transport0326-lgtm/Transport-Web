import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  IconButton,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CloseIcon from "@mui/icons-material/Close";
import BoltIcon from "@mui/icons-material/Bolt";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FireTruckIcon from "@mui/icons-material/FireTruck";
import { fetchPricingSettings } from "../../redux/sagas/pricing&Rate/pricingSettingsAction";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/stores/store";
import type { Fare, ApiSurgeRule } from "../../redux/slices/pricingSettingsSlice";
import { updatePricing } from "../../redux/sagas/pricing&Rate/updatePricingAction";
import { toggleSurge } from "../../redux/sagas/pricing&Rate/toggleSurgeAction";
import { toggleSurgeRule } from "../../redux/sagas/pricing&Rate/toggleSurgeRuleAction";
import { updateSurgeRule } from "../../redux/sagas/pricing&Rate/updateSurgeRuleAction";

// ── Vehicle meta ────────────────────────────────────────────────────────────
type VehicleKey = "bike" | "auto" | "miniTruck" | "truck";

const VEHICLE_META: Record<VehicleKey, { label: string; icon: React.ReactNode }> = {
  bike:      { label: "Bike",       icon: <TwoWheelerIcon sx={{ fontSize: 16 }} /> },
  auto:      { label: "Auto",       icon: <DirectionsCarIcon sx={{ fontSize: 16 }} /> },
  miniTruck: { label: "Mini Truck", icon: <LocalShippingIcon sx={{ fontSize: 16 }} /> },
  truck:     { label: "Truck",      icon: <FireTruckIcon sx={{ fontSize: 16 }} /> },
};

const VEHICLE_ORDER: VehicleKey[] = ["bike", "auto", "miniTruck", "truck"];

// ── Surge rule definitions ───────────────────────────────────────────────────
type SurgeMode = "auto" | "manual";
type SurgeKey = "peak" | "lateNight" | "rain" | "highDemand";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

interface SurgeRule {
  key: SurgeKey;
  id?: string;
  title: string;
  mode: SurgeMode;
  schedule: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  multiplier: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
  days: DayOfWeek[];
  maxFareCap: number | null;
}

const SURGE_RULE_META: Record<SurgeKey, Omit<SurgeRule, "key" | "id" | "schedule" | "multiplier" | "enabled" | "startTime" | "endTime" | "days" | "maxFareCap">> = {
  peak: {
    title: "Peak Hours",
    mode: "manual",
    description: "Switch ON for weekday rush hours when demand is highest",
    icon: <AccessTimeIcon sx={{ fontSize: 22, color: "#ea580c" }} />,
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
  lateNight: {
    title: "Late Night",
    mode: "manual",
    description: "Switch ON when late-night demand spikes",
    icon: <NightsStayIcon sx={{ fontSize: 22, color: "#7c3aed" }} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  rain: {
    title: "Rain / Bad Weather",
    mode: "manual",
    description: "Switch ON during heavy rain, flooding, or extreme weather conditions",
    icon: <ThunderstormIcon sx={{ fontSize: 22, color: "#0284c7" }} />,
    color: "#0284c7",
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  highDemand: {
    title: "High Demand",
    mode: "manual",
    description: "Switch ON when demand far exceeds partner supply",
    icon: <TrendingUpIcon sx={{ fontSize: 22, color: "#16a34a" }} />,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
};

const SURGE_KEY_ORDER: SurgeKey[] = ["peak", "lateNight", "rain", "highDemand"];

function deriveKey(ar: ApiSurgeRule): SurgeKey | null {
  if (ar.trigger === "peak_hours") return "peak";
  if (ar.trigger === "high_demand") return "highDemand";
  const n = (ar.name ?? ar.title ?? "").toLowerCase().replace(/[\s/]/g, "");
  if (n.includes("peak")) return "peak";
  if (n.includes("night") || n.includes("late")) return "lateNight";
  if (n.includes("rain") || n.includes("weather")) return "rain";
  if (n.includes("high") || n.includes("demand")) return "highDemand";
  return null;
}

function buildScheduleLabel(startTime: string | null | undefined, endTime: string | null | undefined, days: DayOfWeek[]): string {
  const daysLabel =
    days.length === 7
      ? "All Days"
      : days.length === 5 && (["Mon", "Tue", "Wed", "Thu", "Fri"] as DayOfWeek[]).every((d) => days.includes(d))
      ? "Mon-Fri"
      : days.length
      ? days.join(", ")
      : "";
  if (startTime && endTime) return daysLabel ? `${daysLabel}  ${startTime} - ${endTime}` : `${startTime} - ${endTime}`;
  return daysLabel || "Active when switched ON";
}

function buildSurgeRulesFromApi(apiRules: ApiSurgeRule[]): SurgeRule[] {
  return SURGE_KEY_ORDER.map((key) => {
    const meta = SURGE_RULE_META[key];
    const ar = apiRules.find((r) => deriveKey(r) === key);
    if (!ar) {
      return {
        key,
        id: undefined,
        ...meta,
        multiplier: 1.0,
        enabled: false,
        startTime: "—",
        endTime: "—",
        days: [...DAYS_OF_WEEK],
        maxFareCap: null,
        schedule: "Active when switched ON",
      };
    }
    const apiDays = ar.schedule?.days ?? [];
    const days: DayOfWeek[] = apiDays.includes("All")
      ? [...DAYS_OF_WEEK]
      : (apiDays.filter((d) => (DAYS_OF_WEEK as readonly string[]).includes(d)) as DayOfWeek[]);
    const startTime = ar.schedule?.startTime || "—";
    const endTime = ar.schedule?.endTime || "—";
    return {
      key,
      id: ar._id ?? ar.id,
      ...meta,
      multiplier: ar.multiplier ?? 1.0,
      enabled: ar.isActive ?? ar.enabled ?? false,
      startTime,
      endTime,
      days,
      maxFareCap: ar.maxFareCap ?? null,
      schedule: buildScheduleLabel(ar.schedule?.startTime, ar.schedule?.endTime, days),
    };
  });
}

// ── Edit Surge Rule modal ───────────────────────────────────────────────────
interface EditSurgeRuleModalProps {
  open: boolean;
  rule: SurgeRule | null;
  vehicleLabel: string;
  globalMaxFare?: number;
  baseFareSample: number;
  onClose: () => void;
  onSave: (updates: { multiplier: number; startTime: string; endTime: string; days: DayOfWeek[]; maxFareCap: number | null }) => void;
}

const EditSurgeRuleModal: React.FC<EditSurgeRuleModalProps> = ({
  open,
  rule,
  vehicleLabel,
  globalMaxFare,
  baseFareSample,
  onClose,
  onSave,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState<DayOfWeek[]>([]);
  const [multiplier, setMultiplier] = useState("");
  const [capValue, setCapValue] = useState("");

  useEffect(() => {
    if (!rule) return;
    setStartTime(rule.startTime);
    setEndTime(rule.endTime);
    setDays(rule.days);
    setMultiplier(`${rule.multiplier}`);
    setCapValue(rule.maxFareCap != null ? String(rule.maxFareCap) : "");
  }, [rule]);

  if (!rule) return null;

  const toggleDay = (d: DayOfWeek) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const mulNum = Number(multiplier.replace("×", "").replace("x", "")) || 0;
  const exampleTotal = baseFareSample * mulNum;

  const handleSave = () => {
    onSave({
      multiplier: mulNum || rule.multiplier,
      startTime,
      endTime,
      days,
      maxFareCap: capValue ? Number(capValue.replace(/[^0-9.]/g, "")) : null,
    });
  };

  const inputBase = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
      fontSize: "0.85rem",
      bgcolor: "#f9fafb",
      "& fieldset": { borderColor: "#e5e7eb" },
    },
    "& input": { py: 1 },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: { sx: { borderRadius: 3, width: 720, maxWidth: "92vw", overflow: "hidden" } },
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: "#0D1B3E", px: 2.5, py: 1.8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: rule.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {rule.icon}
          </Box>
          <Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
              Edit Surge Rule
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
              {rule.title} · {vehicleLabel}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* Timing */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
          <AccessTimeIcon sx={{ fontSize: 17, color: "#0D1B3E" }} />
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>Timing</Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 2, mb: 2.5 }}>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", mb: 0.4 }}>Start Time</Typography>
            <TextField fullWidth size="small" value={startTime} onChange={(e) => setStartTime(e.target.value)} sx={inputBase} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", mb: 0.4 }}>End Time</Typography>
            <TextField fullWidth size="small" value={endTime} onChange={(e) => setEndTime(e.target.value)} sx={inputBase} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", mb: 0.4 }}>Apply On</Typography>
            <Box sx={{ display: "flex", gap: 0.6 }}>
              {DAYS_OF_WEEK.map((d) => {
                const active = days.includes(d);
                return (
                  <Box
                    key={d}
                    onClick={() => toggleDay(d)}
                    sx={{
                      flex: 1,
                      textAlign: "center",
                      py: 0.7,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      borderRadius: 1,
                      cursor: "pointer",
                      bgcolor: active ? "#0D1B3E" : "#fff",
                      color: active ? "#fff" : "#374151",
                      border: `1px solid ${active ? "#0D1B3E" : "#e5e7eb"}`,
                      "&:hover": { bgcolor: active ? "#162b5e" : "#f9fafb" },
                    }}
                  >
                    {d}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Surge Multiplier */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
          <BoltIcon sx={{ fontSize: 17, color: "#f59e0b" }} />
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>Surge Multiplier</Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 2, mb: 2.5, alignItems: "end" }}>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", mb: 0.4 }}>Multiplier Value</Typography>
            <TextField
              fullWidth
              size="small"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              sx={inputBase}
            />
          </Box>
          <Box
            sx={{
              border: "1px solid #fde68a",
              bgcolor: "#fffbeb",
              borderRadius: 1.5,
              px: 2,
              py: 1.2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "0.68rem", color: "#b45309" }}>
                Example  5km trip
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.2 }}>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#b45309" }}>
                  ₹{baseFareSample}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#ea580c" }}>×</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#ea580c" }}>
                  {mulNum || rule.multiplier}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#ea580c" }}>=</Typography>
                <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#E8490F" }}>
                  ₹{exampleTotal.toFixed(1).replace(/\.0$/, "")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Max Fare Cap */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
          <LockIcon sx={{ fontSize: 16, color: "#374151" }} />
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>
            Max Fare Cap (optional)
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 2, mb: 1.5, alignItems: "end" }}>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", mb: 0.4 }}>Override global cap</Typography>
            <TextField
              fullWidth
              size="small"
              value={capValue ? `₹${capValue}` : ""}
              onChange={(e) => setCapValue(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="—"
              sx={inputBase}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              border: "1px solid #bfdbfe",
              bgcolor: "#eff6ff",
              borderRadius: 1.5,
              px: 1.5,
              py: 1.2,
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 15, color: "#2563eb" }} />
            <Typography sx={{ fontSize: "0.78rem", color: "#1e3a8a" }}>
              {globalMaxFare != null
                ? `Global cap is ₹${globalMaxFare}. Override only if needed.`
                : "No global cap set. Override only if needed."}
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ borderTop: "1px solid #f3f4f6", mt: 2, pt: 2, display: "flex", gap: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              borderColor: "#e5e7eb",
              color: "#6b7280",
              fontSize: "0.88rem",
              borderRadius: 2,
              py: 1.1,
              "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={handleSave}
            startIcon={<SaveIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              textTransform: "none",
              bgcolor: "#0D1B3E",
              color: "#fff",
              fontSize: "0.88rem",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.1,
              "&:hover": { bgcolor: "#162b5e" },
            }}
          >
            Save Rule
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const numberFmt = (n: number) =>
  Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

// ── Field row ───────────────────────────────────────────────────────────────
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.88rem",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#cbd5e1" },
    "&.Mui-focused fieldset": { borderColor: "#0D1B3E" },
  },
  "& input": { py: 1 },
};

const LabeledField: React.FC<{
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  width?: number | string;
  placeholder?: string;
  unit?: string;
  required?: boolean;
  error?: string;
}> = ({ label, value, onChange, readOnly, width = "100%", placeholder, unit, required, error }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, py: 1 }}>
    <Typography sx={{ fontSize: "0.85rem", color: "#374151", flexShrink: 0, mt: 1 }}>
      {label}
      {required && <Box component="span" sx={{ color: "#dc2626", ml: 0.4 }}>*</Box>}
    </Typography>
    <Box sx={{ width }}>
      <TextField
        size="small"
        fullWidth
        value={value}
        placeholder={placeholder}
        error={Boolean(error)}
        onChange={(e) => onChange?.(e.target.value)}
        sx={{
          ...fieldSx,
          ...(error
            ? {
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#fca5a5" },
                "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#dc2626" },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#dc2626" },
              }
            : {}),
        }}
        slotProps={{
          input: {
            readOnly,
            ...(unit
              ? {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af", userSelect: "none" }}>
                        {unit}
                      </Typography>
                    </InputAdornment>
                  ),
                }
              : {}),
          },
        }}
      />
      {error && (
        <Typography sx={{ fontSize: "0.68rem", color: "#dc2626", mt: 0.3 }}>
          {error}
        </Typography>
      )}
    </Box>
  </Box>
);

// ── Main ────────────────────────────────────────────────────────────────────
const PricingRates: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.pricingSettings,
  );

  // Re-fetch on every mount (i.e. every time the user navigates to this tab)
  // so surge rule IDs and isActive flags stay fresh.
  useEffect(() => {
    dispatch(fetchPricingSettings());
  }, [dispatch]);

  const fares = data?.fares ?? [];
  const [activeVehicle, setActiveVehicle] = useState<VehicleKey>("bike");
  const activeFare: Fare | undefined = useMemo(
    () => fares.find((f) => f.vehicleType === activeVehicle),
    [fares, activeVehicle],
  );

  // ── Editable base-rate fields ──
  const [baseFare, setBaseFare] = useState("");
  const [perKmRate, setPerKmRate] = useState("");
  const [perMinRate, setPerMinRate] = useState("");
  const [, setMinFare] = useState("");
  const [baseKmIncluded, setBaseKmIncluded] = useState("");
  const [perKm0_10, setPerKm0_10] = useState("");
  const [perKm10_25, setPerKm10_25] = useState("");
  const [perKm25Plus, setPerKm25Plus] = useState("");

  // ── Validation errors for required fields ──
  const [errors, setErrors] = useState<{ baseFare?: string; perKmRate?: string; baseKmIncluded?: string }>({});
  const clearError = (k: "baseFare" | "perKmRate" | "baseKmIncluded") =>
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));

  // ── Saving state for Save Changes button ──
  const [isSaving, setIsSaving] = useState(false);
  // The slice's `loading` flag is shared between the GET and the PATCH; when the
  // PATCH saga finishes (success or fail) loading flips back to false. Watch
  // that falling edge while we're saving to release the button.
  useEffect(() => {
    if (isSaving && !loading) setIsSaving(false);
  }, [isSaving, loading]);
  // const [nightSurcharge, setNightSurcharge] = useState("");
  // const [weekendSurcharge, setWeekendSurcharge] = useState("");

  // ── Surge ──
  const [surgeEnabled, setSurgeEnabled] = useState(false);
  const [surgeRules, setSurgeRules] = useState<SurgeRule[]>([]);

  // ── Caps & limits ──
  // const [maxMulCap, setMaxMulCap] = useState("3.0x");
  // const [maxFare, setMaxFare] = useState("509");
  // const [minMul, setMinMul] = useState("1.0x");
  // const [notifyRiderAt, setNotifyRiderAt] = useState("1.5x");

  // ── Edit-rule modal ──
  const [editingRuleKey, setEditingRuleKey] = useState<SurgeKey | null>(null);
  const editingRule = surgeRules.find((r) => r.key === editingRuleKey) ?? null;

  const handleRuleSave = (updates: { multiplier: number; startTime: string; endTime: string; days: DayOfWeek[]; maxFareCap: number | null }) => {
    if (!editingRuleKey) return;
    const editing = surgeRules.find((r) => r.key === editingRuleKey);
    setSurgeRules((rules) =>
      rules.map((r) => {
        if (r.key !== editingRuleKey) return r;
        const daysLabel =
          updates.days.length === 7
            ? "All Days"
            : updates.days.length === 5 && ["Mon","Tue","Wed","Thu","Fri"].every((d) => updates.days.includes(d as DayOfWeek))
            ? "Mon-Fri"
            : updates.days.join(", ");
        const timing =
          updates.startTime && updates.endTime && updates.startTime !== "—"
            ? `${daysLabel}  ${updates.startTime} - ${updates.endTime}`
            : daysLabel;
        return { ...r, ...updates, schedule: timing };
      }),
    );
    setEditingRuleKey(null);
    if (activeFare && editing) {
      dispatch(
        updateSurgeRule({
          vehicleType: activeFare.vehicleType,
          ruleId: editing.id ?? editing.key,
          name: editing.title,
          multiplier: updates.multiplier,
          maxFareCap: updates.maxFareCap,
          schedule: {
            startTime: updates.startTime,
            endTime: updates.endTime,
            days: updates.days,
          },
        }),
      );
    }
  };

  // Hydrate from API when active fare changes
  useEffect(() => {
    if (!activeFare) return;
    setBaseFare(numberFmt(activeFare.baseFare));
    setPerKmRate(numberFmt(activeFare.perKmRate));
    setPerMinRate(numberFmt(activeFare.perMinRate));
    setMinFare(numberFmt(activeFare.minFare));
    setBaseKmIncluded(activeFare.baseKmIncluded != null ? numberFmt(activeFare.baseKmIncluded) : "");
    setPerKm0_10(activeFare.rate0to10 != null ? numberFmt(activeFare.rate0to10) : "");
    setPerKm10_25(activeFare.rate10to25 != null ? numberFmt(activeFare.rate10to25) : "");
    setPerKm25Plus(activeFare.rate25plus != null ? numberFmt(activeFare.rate25plus) : "");
    setSurgeEnabled(activeFare.surgeEnabled ?? activeFare.surgePricing?.enabled ?? false);
    const apiRules = activeFare.surgeRules ?? [];
    setSurgeRules(buildSurgeRulesFromApi(apiRules));
  }, [activeFare]);

  const toggleRule = (key: SurgeKey) => {
    if (!activeFare) return;
    const rule = surgeRules.find((r) => r.key === key);
    const ruleId = rule?.id ?? key;
    setSurgeRules((rules) =>
      rules.map((r) => (r.key === key ? { ...r, enabled: !r.enabled } : r)),
    );
    dispatch(
      toggleSurgeRule({
        vehicleType: activeFare.vehicleType,
        ruleId,
        onError: () =>
          setSurgeRules((rules) =>
            rules.map((r) =>
              r.key === key ? { ...r, enabled: !r.enabled } : r,
            ),
          ),
      }),
    );
  };

  // Sample fare preview (5km, 15min, first enabled rule's multiplier)
  const SAMPLE_KM = 5;
  const SAMPLE_MIN = 15;
  const previewMultiplier =
    surgeEnabled && surgeRules.find((r) => r.enabled)?.multiplier;
  const previewRuleLabel =
    surgeEnabled && surgeRules.find((r) => r.enabled)?.title;
  const baseKmNum = Number(baseKmIncluded) || 0;
  const billableKm = Math.max(0, SAMPLE_KM - baseKmNum);
  // 5km trip always falls in the 0-10 bracket; prefer tiered rate, fall back to perKmRate
  const effectiveKmRate = Number(perKm0_10) || Number(perKmRate) || 0;
  const previewBase = Number(baseFare) || 0;
  const previewKm = billableKm * effectiveKmRate;
  const previewMin = (Number(perMinRate) || 0) * SAMPLE_MIN;
  const previewSubtotal = previewBase + previewKm + previewMin;
  const previewTotal = previewMultiplier
    ? previewSubtotal * previewMultiplier
    : previewSubtotal;

  const handleSave = () => {
    if (!activeFare || isSaving) return;
    const toNum = (s: string): number | undefined => {
      const t = s.trim();
      if (!t) return undefined;
      const n = Number(t);
      return Number.isFinite(n) ? n : undefined;
    };

    const nextErrors: typeof errors = {};
    const validateRequired = (key: "baseFare" | "perKmRate" | "baseKmIncluded", raw: string, label: string) => {
      const t = raw.trim();
      if (!t) nextErrors[key] = `${label} is required.`;
      else if (!Number.isFinite(Number(t))) nextErrors[key] = `${label} must be a number.`;
      else if (Number(t) < 0) nextErrors[key] = `${label} must be 0 or greater.`;
    };
    validateRequired("baseFare", baseFare, "Base Fare");
    validateRequired("perKmRate", perKmRate, "Per KM Rate");
    validateRequired("baseKmIncluded", baseKmIncluded, "Base KM Included");
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    setIsSaving(true);
    dispatch(
      updatePricing({
        vehicleType: activeFare.vehicleType,
        baseFare: Number(baseFare),
        perKmRate: Number(perKmRate),
        baseKmIncluded: toNum(baseKmIncluded),
        perMinRate: toNum(perMinRate),
        minFare: activeFare.minFare,
        rate0to10: toNum(perKm0_10),
        rate10to25: toNum(perKm10_25),
        rate25plus: toNum(perKm25Plus),
        surgeEnabled,
        maxSurgeCap: activeFare.surgePricing?.maxSurgeCap,
      }),
    );
  };

  const handleCancel = () => {
    if (!activeFare) return;
    setBaseFare(numberFmt(activeFare.baseFare));
    setPerKmRate(numberFmt(activeFare.perKmRate));
    setPerMinRate(numberFmt(activeFare.perMinRate));
    setMinFare(numberFmt(activeFare.minFare));
    setErrors({});
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#0D1B3E" }} />
      </Box>
    );
  }

  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box>
      {/* Page title */}
      <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1a1a2e", mb: 2 }}>
        Pricing &amp; Rates
      </Typography>

      {/* Vehicle tabs */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 0.6,
          mb: 3,
          bgcolor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          width: "fit-content",
        }}
      >
        {VEHICLE_ORDER.map((v) => {
          const isActive = activeVehicle === v;
          const meta = VEHICLE_META[v];
          return (
            <Box
              key={v}
              onClick={() => setActiveVehicle(v)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                px: 2,
                py: 0.9,
                borderRadius: 1.5,
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: 600,
                bgcolor: isActive ? "#fff5f0" : "transparent",
                border: `1px solid ${isActive ? "#fed7aa" : "transparent"}`,
                color: isActive ? "#E8490F" : "#374151",
                "&:hover": { bgcolor: isActive ? "#fff5f0" : "#f9fafb" },
              }}
            >
              {meta.icon}
              {meta.label}
            </Box>
          );
        })}
      </Box>

      {/* ── Base Rate ── */}
      <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", mb: 1.5 }}>
        Base Rate
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 4,
          rowGap: 0.5,
          mb: 3.5,
        }}
      >
        <LabeledField label="Base Fare"        value={baseFare}       onChange={(v) => { setBaseFare(v); clearError("baseFare"); }}             unit="₹"     placeholder="e.g. 50"  width={220} required error={errors.baseFare} />
        <LabeledField label="Per KM Rate"      value={perKmRate}      onChange={(v) => { setPerKmRate(v); clearError("perKmRate"); }}           unit="₹/km"  placeholder="e.g. 15"  width={220} required error={errors.perKmRate} />
        <LabeledField label="Base KM Included" value={baseKmIncluded} onChange={(v) => { setBaseKmIncluded(v); clearError("baseKmIncluded"); }} unit="km"    placeholder="e.g. 2"   width={220} required error={errors.baseKmIncluded} />
        <LabeledField label="0–10 KM Rate"     value={perKm0_10}      onChange={setPerKm0_10}      unit="₹/km"  placeholder="e.g. 15"  width={220} />
        <LabeledField label="10–25 KM Rate"    value={perKm10_25}     onChange={setPerKm10_25}     unit="₹/km"  placeholder="e.g. 12"  width={220} />
        <LabeledField label="25+ KM Rate"      value={perKm25Plus}    onChange={setPerKm25Plus}    unit="₹/km"  placeholder="e.g. 10"  width={220} />
        {/* <LabeledField label="Per Minute Rate (₹)" value={perMinRate} onChange={setPerMinRate}   width={220} />
        <LabeledField label="Minimum Fare (₹)"  value={minFare}      onChange={setMinFare}      width={220} />
        <LabeledField label="Night Surcharge (10PM-6AM)" value={nightSurcharge}   onChange={setNightSurcharge}   width={220} />
        <LabeledField label="Weekend Surcharge (Sat-Sun)" value={weekendSurcharge} onChange={setWeekendSurcharge} width={220} /> */}
      </Box>

      {/* ── Surge Pricing ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e" }}>
          Surge Pricing
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={{ fontSize: "0.82rem", color: "#374151" }}>
            Enable Surge Pricing for {VEHICLE_META[activeVehicle].label}
          </Typography>
          <Switch
            checked={surgeEnabled}
            onChange={(e) => {
              const next = e.target.checked;
              setSurgeEnabled(next);
              if (activeFare) {
                dispatch(
                  toggleSurge({
                    vehicleType: activeFare.vehicleType,
                    surgeEnabled: next,
                    onError: () => setSurgeEnabled(!next),
                  }),
                );
              }
            }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                bgcolor: "#16a34a",
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>

      {/* Info banner */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          bgcolor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 1.5,
          px: 1.8,
          py: 1.2,
          mb: 2,
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 16, color: "#2563eb", mt: 0.2, flexShrink: 0 }} />
        <Typography sx={{ fontSize: "0.78rem", color: "#1e3a8a", lineHeight: 1.5 }}>
          All surge rules are applied manually — switch a rule ON to activate it.<br />
          Surge multipliers stack with the base rate. Customer pays Base Fare × Multiplier.
        </Typography>
      </Box>

      <Typography sx={{ fontSize: "0.78rem", color: surgeEnabled ? "#6b7280" : "#cbd5e1", mb: 1.2 }}>
        Surge Application Order:
      </Typography>

      {/* Surge rule cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.2,
          mb: 3.5,
          opacity: surgeEnabled ? 1 : 0.6,
          pointerEvents: surgeEnabled ? "auto" : "none",
        }}
        aria-disabled={!surgeEnabled}
      >
        {surgeRules.map((rule) => (
          <Box
            key={rule.key}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              border: `1px solid ${rule.enabled ? rule.border : "#e5e7eb"}`,
              borderLeft: `4px solid ${rule.color}`,
              borderRadius: 2,
              p: 1.8,
              bgcolor: rule.enabled ? rule.bg : "#fff",
              transition: "all 0.2s",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: rule.bg,
                border: `1px solid ${rule.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {rule.icon}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.2 }}>
                <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827" }}>
                  {rule.title}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", ml: 0.5 }}>
                  {rule.schedule}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                {rule.description}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3 }}>
              <Box
                sx={{
                  border: "1px solid #fde68a",
                  bgcolor: "#fffbeb",
                  borderRadius: 1.5,
                  px: 1.2,
                  py: 0.3,
                }}
              >
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#b45309" }}>
                  {rule.multiplier.toFixed(1)}x
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.6rem", color: "#9ca3af" }}>multiplier</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4, alignItems: "stretch", minWidth: 80 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                <Switch
                  size="small"
                  checked={rule.enabled}
                  disabled={!surgeEnabled}
                  onChange={() => toggleRule(rule.key)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      bgcolor: "#16a34a",
                      opacity: 1,
                    },
                  }}
                />
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: rule.enabled ? "#16a34a" : "#9ca3af" }}>
                  {rule.enabled ? "ON" : "OFF"}
                </Typography>
              </Box>
              <Button
                size="small"
                disabled={!surgeEnabled}
                onClick={() => setEditingRuleKey(rule.key)}
                startIcon={<EditIcon sx={{ fontSize: "12px !important" }} />}
                sx={{
                  fontSize: "0.7rem",
                  textTransform: "none",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                  borderRadius: 1.2,
                  py: 0.1,
                  minWidth: 0,
                  "&:hover": { bgcolor: "#eff6ff" },
                }}
              >
                Edit
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ── Caps & Limits ── */}
      {/* <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", mb: 1.5 }}>
        Caps &amp; Limits
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 4,
          rowGap: 0.5,
          mb: 3.5,
        }}
      >
        <LabeledField label="Max Multiplier Cap" value={maxMulCap}     onChange={setMaxMulCap}     width={220} />
        <LabeledField label="Max Fare (any ride)" value={`₹${maxFare}`} onChange={(v) => setMaxFare(v.replace(/[^0-9.]/g, ""))} width={220} />
        <LabeledField label="Min Multiplier"     value={minMul}        onChange={setMinMul}        width={220} />
        <LabeledField label="Notify Rider At"    value={notifyRiderAt} onChange={setNotifyRiderAt} width={220} />
      </Box> */}

      {/* ── Sample Fare Preview ── */}
      <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", mb: 0.4 }}>
        Sample Fare Preview
      </Typography>
      <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", mb: 1 }}>
        Estimated for a {SAMPLE_KM} km, {SAMPLE_MIN} min trip
        {baseKmNum > 0 ? ` · ${baseKmNum} km base included` : ""}
        {previewMultiplier
          ? ` · ${previewRuleLabel} surge (${previewMultiplier.toFixed(1)}×) active`
          : ""}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: previewMultiplier ? "repeat(5, 1fr)" : "repeat(4, 1fr)",
          gap: 1.5,
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          p: 2,
          bgcolor: "#fff",
          mb: 3.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}>Base Fare</Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
            ₹{previewBase}
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: "#9ca3af" }}>Flat start</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}>Distance</Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
            ₹{previewKm}
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: "#9ca3af" }}>
            {billableKm}km × ₹{effectiveKmRate}{baseKmNum > 0 ? ` (−${baseKmNum}km base)` : ""}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}>Time</Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
            ₹{previewMin}
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: "#9ca3af" }}>
            {SAMPLE_MIN}min × ₹{perMinRate || 0}
          </Typography>
        </Box>
        {previewMultiplier && (
          <Box>
            <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}>
              Surge ({previewMultiplier.toFixed(1)}×)
            </Typography>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#b45309" }}>
              × {previewMultiplier.toFixed(1)}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "#9ca3af" }}>
              {previewRuleLabel}
            </Typography>
          </Box>
        )}
        <Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}>Est. Total</Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#E8490F" }}>
            ₹{previewTotal.toFixed(1).replace(/\.0$/, "")}
          </Typography>
        </Box>
      </Box>

      {/* ── Actions ── */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 1 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            textTransform: "none",
            borderColor: "#e5e7eb",
            color: "#374151",
            fontSize: "0.85rem",
            borderRadius: 2,
            px: 3,
            "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSave}
          disabled={!activeFare || isSaving || loading}
          startIcon={
            isSaving ? (
              <CircularProgress size={14} sx={{ color: "#fff" }} />
            ) : undefined
          }
          sx={{
            textTransform: "none",
            bgcolor: "#E8490F",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            "&:hover": { bgcolor: "#c93d0c" },
            "&.Mui-disabled": { bgcolor: "#f3b89a", color: "#fff" },
          }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>

      <EditSurgeRuleModal
        open={Boolean(editingRule)}
        rule={editingRule}
        vehicleLabel={VEHICLE_META[activeVehicle].label}
        // globalMaxFare={Number(maxFare) || 509}
        baseFareSample={Math.round(previewSubtotal)}
        onClose={() => setEditingRuleKey(null)}
        onSave={handleRuleSave}
      />
    </Box>
  );
};

export default PricingRates;
