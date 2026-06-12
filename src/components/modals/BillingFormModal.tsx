import { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import BuildIcon from "@mui/icons-material/Build";
import type { BillingRecord } from "../../redux/slices/billingSlice";

type Category = "Domain" | "Hosting" | "Security" | "API Service" | "Email" | "Storage" | "Payments";

const categories: Category[] = ["Domain", "Hosting", "Security", "API Service", "Email", "Storage", "Payments"];
const autoRemindOptions = ["None", "7 days before", "14 days before", "30 days before", "90 days before"];
const billingCycleOptions = ["Monthly", "Quarterly", "Bi-Annual", "Annual"];

const emptyForm = {
  service: "",
  category: "Domain" as Category,
  amount: "",
  paidOn: "",
  nextRenewal: "",
  autoRemind: "",
  billingCycle: "",
  notes: "",
};

type FormErrors = {
  service?: string;
  amount?: string;
  paidOn?: string;
  nextRenewal?: string;
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: "0.85rem",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#bbb" },
    "&.Mui-focused fieldset": { borderColor: "#0D1B3E" },
    "&.Mui-error fieldset": { borderColor: "#ed3333" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.82rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0D1B3E" },
};

const toIsoDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

const formatDisplayDate = (isoStr: string) => {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// DD/MM/YYYY → YYYY-MM-DD (returns "" if invalid)
const dmyToIso = (dmy: string): string => {
  const parts = dmy.split("/");
  if (parts.length !== 3) return "";
  const [d, m, y] = parts;
  if (d.length < 1 || d.length > 2 || m.length < 1 || m.length > 2 || y.length !== 4) return "";
  const dn = Number(d);
  const mn = Number(m);
  const yn = Number(y);
  if (isNaN(dn) || isNaN(mn) || isNaN(yn)) return "";
  if (mn < 1 || mn > 12 || dn < 1 || dn > 31) return "";
  const date = new Date(yn, mn - 1, dn);
  if (date.getFullYear() !== yn || date.getMonth() !== mn - 1 || date.getDate() !== dn) return "";
  return `${y}-${String(mn).padStart(2, "0")}-${String(dn).padStart(2, "0")}`;
};

// ── Three-segment date input helpers ──────────────────────────────────────────
type DateRef = React.RefObject<HTMLInputElement | null>;

const syncDateSegs = (iso: string, dayRef: DateRef, monRef: DateRef, yrRef: DateRef) => {
  const [y = "", m = "", d = ""] = iso ? iso.split("-") : [];
  if (dayRef.current) dayRef.current.value = d;
  if (monRef.current) monRef.current.value = m;
  if (yrRef.current) yrRef.current.value = y;
};

const readDateSegs = (dayRef: DateRef, monRef: DateRef, yrRef: DateRef): string =>
  dmyToIso(
    `${dayRef.current?.value ?? ""}/${monRef.current?.value ?? ""}/${yrRef.current?.value ?? ""}`,
  );

// ─────────────────────────────────────────────────────────────────────────────

export interface BillingFormData {
  serviceName: string;
  category: Category;
  amount: number;
  paidOn: string;
  nextRenewal: string;
  billingCycle: string;
  autoRemindBefore: string;
  notes: string;
}

interface BillingFormModalProps {
  open: boolean;
  onClose: () => void;
  editRecord: BillingRecord | null;
  onSave: (data: BillingFormData) => void;
}

const BillingFormModal = ({ open, onClose, editRecord, onSave }: BillingFormModalProps) => {
  const [form, setForm] = useState<typeof emptyForm>({ ...emptyForm });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paidOnError, setPaidOnError] = useState("");
  const [renewalError, setRenewalError] = useState("");

  // Six refs for the two date fields
  const paidDayRef = useRef<HTMLInputElement>(null);
  const paidMonRef = useRef<HTMLInputElement>(null);
  const paidYrRef = useRef<HTMLInputElement>(null);
  const renewDayRef = useRef<HTMLInputElement>(null);
  const renewMonRef = useRef<HTMLInputElement>(null);
  const renewYrRef = useRef<HTMLInputElement>(null);
  const lastValidPaidOn = useRef("");
  const lastValidRenewal = useRef("");

  // Sync form state (React) when dialog opens
  useEffect(() => {
    if (open) {
      setErrors({});
      setPaidOnError("");
      setRenewalError("");
      if (editRecord !== null) {
        const paidIso = toIsoDate(editRecord.paidOn);
        const renewIso = toIsoDate(editRecord.nextRenewal);
        setForm({
          service: editRecord.serviceName,
          category: editRecord.category as Category,
          amount: String(editRecord.amount),
          paidOn: paidIso,
          nextRenewal: renewIso,
          autoRemind: editRecord.autoRemindBefore ?? "",
          billingCycle: editRecord.billingCycle ?? "",
          notes: editRecord.notes ?? "",
        });
      } else {
        setForm({ ...emptyForm });
      }
    }
  }, [open, editRecord]);

  // Sync DOM refs synchronously before paint so inputs show the right values
  useLayoutEffect(() => {
    if (!open) return;
    if (editRecord !== null) {
      const paidIso = toIsoDate(editRecord.paidOn);
      const renewIso = toIsoDate(editRecord.nextRenewal);
      lastValidPaidOn.current = paidIso;
      lastValidRenewal.current = renewIso;
      syncDateSegs(paidIso, paidDayRef, paidMonRef, paidYrRef);
      syncDateSegs(renewIso, renewDayRef, renewMonRef, renewYrRef);
    } else {
      lastValidPaidOn.current = "";
      lastValidRenewal.current = "";
      syncDateSegs("", paidDayRef, paidMonRef, paidYrRef);
      syncDateSegs("", renewDayRef, renewMonRef, renewYrRef);
    }
  }, [open, editRecord]);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  // Combined error setter: clears the form-level error when segment error clears
  const setPaidError = (msg: string) => {
    setPaidOnError(msg);
    if (!msg) clearError("paidOn");
  };
  const setRenewError = (msg: string) => {
    setRenewalError(msg);
    if (!msg) clearError("nextRenewal");
  };

  // ── Segment event handlers ───────────────────────────────────────────────

  const handleDateSegInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    position: "day" | "mon" | "yr",
    maxLen: number,
    next: DateRef | null,
    dayRef: DateRef,
    monRef: DateRef,
    yrRef: DateRef,
    setIso: (v: string) => void,
    setError: (v: string) => void,
    lastValid: React.RefObject<string>,
  ) => {
    const input = e.currentTarget;
    const digits = input.value.replace(/\D/g, "").slice(0, maxLen);
    input.value = digits;

    // Smart early auto-advance
    if (digits.length === 1 && next?.current) {
      const n = Number(digits);
      if ((position === "day" && n > 3) || (position === "mon" && n > 1)) {
        next.current.focus();
        next.current.select();
      }
    } else if (digits.length === maxLen && next?.current) {
      next.current.focus();
      next.current.select();
    }

    const iso = readDateSegs(dayRef, monRef, yrRef);
    if (iso) {
      lastValid.current = iso;
      setIso(iso);
      setError("");
    } else {
      setIso("");
      const d = dayRef.current?.value ?? "";
      const m = monRef.current?.value ?? "";
      const y = yrRef.current?.value ?? "";
      const isComplete = d.length === 2 && m.length === 2 && y.length === 4;
      setError(isComplete ? "Invalid date" : "");
    }
  };

  const handleDateSegKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prev: DateRef | null,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && prev?.current) {
      prev.current.focus();
      prev.current.select();
    }
  };

  const handleDateSegBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    dayRef: DateRef,
    monRef: DateRef,
    yrRef: DateRef,
    setIso: (v: string) => void,
    setError: (v: string) => void,
    lastValid: React.RefObject<string>,
  ) => {
    const rel = e.relatedTarget as HTMLElement | null;
    if (rel && (rel === dayRef.current || rel === monRef.current || rel === yrRef.current)) return;

    const d = dayRef.current?.value ?? "";
    const m = monRef.current?.value ?? "";
    const y = yrRef.current?.value ?? "";

    if (!d && !m && !y) {
      lastValid.current = "";
      setIso("");
      setError("");
      return;
    }

    // Clamp out-of-range values before validating
    if (dayRef.current && d && Number(d) > 31) dayRef.current.value = "31";
    if (dayRef.current && d && Number(d) < 1) dayRef.current.value = "01";
    if (monRef.current && m && Number(m) > 12) monRef.current.value = "12";
    if (monRef.current && m && Number(m) < 1) monRef.current.value = "01";

    const iso = readDateSegs(dayRef, monRef, yrRef);
    if (iso) {
      lastValid.current = iso;
      setIso(iso);
      setError("");
      syncDateSegs(iso, dayRef, monRef, yrRef);
    } else if (lastValid.current) {
      syncDateSegs(lastValid.current, dayRef, monRef, yrRef);
      setIso(lastValid.current);
      setError("");
    } else {
      const d2 = dayRef.current?.value ?? "";
      const m2 = monRef.current?.value ?? "";
      const y2 = yrRef.current?.value ?? "";
      const isComplete = d2.length === 2 && m2.length === 2 && y2.length === 4;
      setError(isComplete ? "Invalid date" : (d2 || m2 || y2 ? "Incomplete date" : ""));
    }
  };

  // ── Render helper ────────────────────────────────────────────────────────

  const segStyle: React.CSSProperties = {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "0.85rem",
    color: "#374151",
    fontFamily: "inherit",
    width: "26px",
    textAlign: "center",
    padding: 0,
  };

  const slashStyle: React.CSSProperties = {
    color: "#d1d5db",
    fontSize: "0.9rem",
    userSelect: "none",
    lineHeight: 1,
    flexShrink: 0,
  };

  const renderDateInput = (
    dayRef: DateRef,
    monRef: DateRef,
    yrRef: DateRef,
    setIso: (v: string) => void,
    setError: (v: string) => void,
    lastValid: React.RefObject<string>,
    error: string,
  ) => (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: `1px solid ${error ? "#ed3333" : "#e0e0e0"}`,
          borderRadius: 1.5,
          px: 1.5,
          height: 36,
          bgcolor: error ? "#fff8f8" : "#fff",
          transition: "border-color 0.15s, background 0.15s",
          "&:focus-within": {
            borderColor: error ? "#ed3333" : "#0D1B3E",
            boxShadow: error ? "none" : "0 0 0 2px rgba(13,27,62,0.08)",
          },
          gap: "2px",
        }}
      >
        <input
          ref={dayRef}
          type="text"
          inputMode="numeric"
          placeholder="DD"
          maxLength={2}
          onChange={(e) =>
            handleDateSegInput(e, "day", 2, monRef, dayRef, monRef, yrRef, setIso, setError, lastValid)
          }
          onKeyDown={(e) => handleDateSegKeyDown(e, null)}
          onBlur={(e) => handleDateSegBlur(e, dayRef, monRef, yrRef, setIso, setError, lastValid)}
          style={segStyle}
        />
        <span style={slashStyle}>/</span>
        <input
          ref={monRef}
          type="text"
          inputMode="numeric"
          placeholder="MM"
          maxLength={2}
          onChange={(e) =>
            handleDateSegInput(e, "mon", 2, yrRef, dayRef, monRef, yrRef, setIso, setError, lastValid)
          }
          onKeyDown={(e) => handleDateSegKeyDown(e, dayRef)}
          onBlur={(e) => handleDateSegBlur(e, dayRef, monRef, yrRef, setIso, setError, lastValid)}
          style={segStyle}
        />
        <span style={slashStyle}>/</span>
        <input
          ref={yrRef}
          type="text"
          inputMode="numeric"
          placeholder="YYYY"
          maxLength={4}
          onChange={(e) =>
            handleDateSegInput(e, "yr", 4, null, dayRef, monRef, yrRef, setIso, setError, lastValid)
          }
          onKeyDown={(e) => handleDateSegKeyDown(e, monRef)}
          onBlur={(e) => handleDateSegBlur(e, dayRef, monRef, yrRef, setIso, setError, lastValid)}
          style={{ ...segStyle, width: "44px" }}
        />
      </Box>
      {error && (
        <Typography sx={{ fontSize: "0.7rem", color: "#ed3333", mt: 0.4, lineHeight: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = () => {
    // Re-read from DOM to avoid stale state when user clicks Save immediately after typing
    const paidIso = readDateSegs(paidDayRef, paidMonRef, paidYrRef) || form.paidOn;
    const renewIso = readDateSegs(renewDayRef, renewMonRef, renewYrRef) || form.nextRenewal;
    const snap = { ...form, paidOn: paidIso, nextRenewal: renewIso };

    const e: FormErrors = {};

    const service = snap.service.trim();
    if (!service) e.service = "Service name is required";
    else if (service.length < 2) e.service = "Must be at least 2 characters";
    else if (service.length > 100) e.service = "Must be at most 100 characters";
    else if (!/^[a-zA-Z0-9\s.\-]+$/.test(service))
      e.service = "Only letters, numbers, spaces, dots, and hyphens allowed";

    const amount = snap.amount.trim();
    if (!amount) e.amount = "Amount is required";
    else if (isNaN(Number(amount))) e.amount = "Enter a valid amount";
    else if (Number(amount) <= 0) e.amount = "Amount must be greater than 0";
    else if (Number(amount) > 50000) e.amount = "Amount must not exceed ₹50,000";

    if (!snap.paidOn) {
      e.paidOn = "Paid on date is required";
    } else {
      const paid = new Date(snap.paidOn);
      if (isNaN(paid.getTime())) {
        e.paidOn = "Enter a valid date";
      } else {
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        if (paid > endOfToday) e.paidOn = "Paid date cannot be in the future";
      }
    }

    if (!snap.nextRenewal) {
      e.nextRenewal = "Next renewal date is required";
    } else {
      const renew = new Date(snap.nextRenewal);
      if (isNaN(renew.getTime())) {
        e.nextRenewal = "Enter a valid date";
      } else if (snap.paidOn) {
        const paid = new Date(snap.paidOn);
        if (!isNaN(paid.getTime()) && renew <= paid)
          e.nextRenewal = "Must be after the paid on date";
      }
    }

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    onSave({
      serviceName: snap.service,
      category: snap.category,
      amount: Number(snap.amount),
      paidOn: snap.paidOn,
      nextRenewal: snap.nextRenewal,
      billingCycle: snap.billingCycle,
      autoRemindBefore: snap.autoRemind,
      notes: snap.notes,
    });
    onClose();
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle sx={{ pb: 0.5, pt: 2.5, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {editRecord !== null && (
                <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: "#fff5f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <EditIcon sx={{ fontSize: 15, color: "#E8490F" }} />
                </Box>
              )}
              <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#111827" }}>
                {editRecord !== null ? "Edit Payment" : "Add New Payment"}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", mt: 0.3 }}>
              {editRecord !== null ? "Update the payment record below" : "Fill in the service payment details below"}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: "#6b7280", mt: -0.5, "&:hover": { bgcolor: "#f3f4f6" } }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.8, pt: "12px !important", px: 3 }}>
        {/* Service Name */}
        <Box>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.6 }}>
            Service Name <span style={{ color: "#E8490F" }}>*</span>
          </Typography>
          <TextField
            placeholder="e.g. transpport.com, AWS Server, SSL..."
            value={form.service}
            onChange={(e) => {
              const value = e.target.value;
              if (value && !/^[a-zA-Z0-9\s.\-]*$/.test(value)) return;
              setForm((f) => ({ ...f, service: value }));
              clearError("service");
            }}
            fullWidth size="small" sx={fieldSx}
            error={!!errors.service}
            helperText={errors.service || `${form.service.length}/100`}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><BuildIcon sx={{ fontSize: 16, color: "#9ca3af" }} /></InputAdornment> }, htmlInput: { maxLength: 100 } }}
          />
        </Box>

        {/* Category + Amount */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.6 }}>
              Category <span style={{ color: "#E8490F" }}>*</span>
            </Typography>
            <FormControl fullWidth size="small" sx={fieldSx}>
              <Select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                displayEmpty
              >
                {categories.map((c) => <MenuItem key={c} value={c} sx={{ fontSize: "0.85rem" }}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.6 }}>
              Amount (₹) <span style={{ color: "#E8490F" }}>*</span>
            </Typography>
            <TextField
              placeholder="0.00"
              type="number"
              value={form.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value && !/^\d*\.?\d{0,2}$/.test(value)) return;
                setForm((f) => ({ ...f, amount: value }));
                clearError("amount");
              }}
              fullWidth size="small" sx={fieldSx}
              error={!!errors.amount}
              helperText={errors.amount || "Max ₹50,000"}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: "0.85rem", color: "#374151" }}>₹</Typography></InputAdornment> }, htmlInput: { min: 0, max: 50000, step: "0.01" } }}
            />
          </Box>
        </Box>

        {/* Paid On + Next Renewal — three-segment date inputs */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.6 }}>
              Paid On <span style={{ color: "#E8490F" }}>*</span>
            </Typography>
            {renderDateInput(
              paidDayRef, paidMonRef, paidYrRef,
              (iso) => { setForm((f) => ({ ...f, paidOn: iso })); clearError("paidOn"); },
              setPaidError,
              lastValidPaidOn,
              errors.paidOn || paidOnError,
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.6 }}>
              Next Renewal Date <span style={{ color: "#E8490F" }}>*</span>
            </Typography>
            {renderDateInput(
              renewDayRef, renewMonRef, renewYrRef,
              (iso) => { setForm((f) => ({ ...f, nextRenewal: iso })); clearError("nextRenewal"); },
              setRenewError,
              lastValidRenewal,
              errors.nextRenewal || renewalError,
            )}
          </Box>
        </Box>

        {/* Auto-Remind + Billing Cycle */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.6 }}>
              Auto-Remind Before
            </Typography>
            <FormControl fullWidth size="small" sx={fieldSx}>
              <Select
                value={form.autoRemind}
                onChange={(e) => setForm((f) => ({ ...f, autoRemind: e.target.value }))}
                displayEmpty
                renderValue={(val) => val || <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Select period</span>}
              >
                <MenuItem value=""><em style={{ fontStyle: "normal", color: "#9ca3af" }}>Select period</em></MenuItem>
                {autoRemindOptions.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: "0.85rem" }}>{o}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.6 }}>
              Billing Cycle
            </Typography>
            <FormControl fullWidth size="small" sx={fieldSx}>
              <Select
                value={form.billingCycle}
                onChange={(e) => setForm((f) => ({ ...f, billingCycle: e.target.value }))}
                displayEmpty
                renderValue={(val) => val || <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Select cycle</span>}
              >
                <MenuItem value=""><em style={{ fontStyle: "normal", color: "#9ca3af" }}>Select cycle</em></MenuItem>
                {billingCycleOptions.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: "0.85rem" }}>{o}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Notes */}
        <Box>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.6 }}>
            Notes / Description
          </Typography>
          <TextField
            placeholder="Any additional details about this payment..."
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            fullWidth multiline rows={3} size="small" sx={fieldSx}
            helperText={`${form.notes.length}/500`}
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
        </Box>

        {editRecord !== null && (
          <Box sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 1.5, px: 2, py: 1 }}>
            <Typography sx={{ fontSize: "0.72rem", color: "#2563eb" }}>
              ⚡ Last edited: {editRecord.lastEditedAt ? formatDisplayDate(editRecord.lastEditedAt) : "—"} · Original amount: ₹{editRecord.originalAmount?.toLocaleString("en-IN")} · Paid via: {editRecord.paidVia}
            </Typography>
          </Box>
        )}

        {Object.keys(errors).length > 1 && (
          <Box sx={{ bgcolor: "#fff5f5", border: "1px solid rgba(237,51,51,0.3)", borderRadius: 1.5, px: 2, py: 1 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#ed3333", fontWeight: 500 }}>
              Please fill in all required fields marked with *
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, display: "flex", gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 2, px: 2.5, fontSize: "0.85rem", "&:hover": { bgcolor: "#f9fafb" } }}
        >
          Cancel
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={handleSave}
          variant="contained"
          disableElevation
          startIcon={editRecord !== null ? <SaveIcon sx={{ fontSize: "16px !important" }} /> : <AddIcon sx={{ fontSize: "16px !important" }} />}
          sx={{ textTransform: "none", bgcolor: "#E8490F", color: "#fff", fontWeight: 600, borderRadius: 2, px: 2.5, fontSize: "0.85rem", "&:hover": { bgcolor: "#c93d0c" } }}
        >
          {editRecord !== null ? "Save Changes" : "Save Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingFormModal;
