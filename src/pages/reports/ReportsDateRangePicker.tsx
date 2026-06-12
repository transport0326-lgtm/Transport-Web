import React, { useLayoutEffect, useRef, useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  PRESET_OPTIONS,
  dateToYMD,
  formatDate,
  fromDMY,
  resolveFilterToRange,
  toDMY,
  type FilterType,
} from "./ReportsHelpers";

interface ReportsDateRangePickerProps {
  appliedFrom: string;
  appliedTo: string;
  todayYMD: string;
  onApply: (from: string, to: string) => void;
}

type InputRef = React.RefObject<HTMLInputElement | null>;
type StringRef = React.RefObject<string>;

const syncSegs = (ymd: string, dayRef: InputRef, monRef: InputRef, yrRef: InputRef) => {
  const [d = "", m = "", y = ""] = ymd ? toDMY(ymd).split("/") : ["", "", ""];
  if (dayRef.current) dayRef.current.value = d;
  if (monRef.current) monRef.current.value = m;
  if (yrRef.current) yrRef.current.value = y;
};

const ReportsDateRangePicker: React.FC<ReportsDateRangePickerProps> = ({
  appliedFrom,
  appliedTo,
  todayYMD,
  onApply,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [draftFrom, setDraftFrom] = useState(appliedFrom);
  const [draftTo, setDraftTo] = useState(appliedTo);
  const [fromError, setFromError] = useState("");
  const [toError, setToError] = useState("");

  const fromDayRef = useRef<HTMLInputElement>(null);
  const fromMonRef = useRef<HTMLInputElement>(null);
  const fromYrRef = useRef<HTMLInputElement>(null);
  const toDayRef = useRef<HTMLInputElement>(null);
  const toMonRef = useRef<HTMLInputElement>(null);
  const toYrRef = useRef<HTMLInputElement>(null);

  const lastValidFrom = useRef(appliedFrom);
  const lastValidTo = useRef(appliedTo);

  // Range error — recalculated each render from current drafts
  const rangeError =
    draftFrom && draftTo && draftFrom > draftTo ? "'From' must be before 'To'" : "";

  const applyDisabled = !draftFrom || !draftTo || !!fromError || !!toError || !!rangeError;

  useLayoutEffect(() => {
    if (!anchorEl) return;
    syncSegs(draftFrom, fromDayRef, fromMonRef, fromYrRef);
    syncSegs(draftTo, toDayRef, toMonRef, toYrRef);
  }, [anchorEl]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    lastValidFrom.current = appliedFrom;
    lastValidTo.current = appliedTo;
    setDraftFrom(appliedFrom);
    setDraftTo(appliedTo);
    setFromError("");
    setToError("");
    setAnchorEl(e.currentTarget);
  };

  const readYmd = (dayRef: InputRef, monRef: InputRef, yrRef: InputRef) =>
    fromDMY(
      `${dayRef.current?.value ?? ""}/${monRef.current?.value ?? ""}/${yrRef.current?.value ?? ""}`,
    );

  const handleSegInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    position: "day" | "mon" | "yr",
    next: InputRef | null,
    dayRef: InputRef,
    monRef: InputRef,
    yrRef: InputRef,
    setDraft: (v: string) => void,
    setError: (v: string) => void,
    lastValid: StringRef,
  ) => {
    const input = e.currentTarget;
    const digits = input.value.replace(/\D/g, "").slice(0, 2);
    input.value = digits;

    // Smart early auto-advance: first digit beyond possible range for that field
    if (digits.length === 1 && next?.current) {
      const n = Number(digits);
      if ((position === "day" && n > 3) || (position === "mon" && n > 1)) {
        next.current.focus();
        next.current.select();
      }
    } else if (digits.length === 2 && next?.current) {
      next.current.focus();
      next.current.select();
    }

    const ymd = readYmd(dayRef, monRef, yrRef);
    if (ymd) {
      lastValid.current = ymd;
      setDraft(ymd);
      setError("");
    } else {
      setDraft("");
      // Only show error once all three segments are fully filled
      const d = dayRef.current?.value ?? "";
      const m = monRef.current?.value ?? "";
      const y = yrRef.current?.value ?? "";
      setError(d.length === 2 && m.length === 2 && y.length === 2 ? "Invalid date" : "");
    }
  };

  const handleSegKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prev: InputRef | null,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && prev?.current) {
      prev.current.focus();
      prev.current.select();
    }
  };

  const handleSegBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    dayRef: InputRef,
    monRef: InputRef,
    yrRef: InputRef,
    setDraft: (v: string) => void,
    setError: (v: string) => void,
    lastValid: StringRef,
  ) => {
    const rel = e.relatedTarget as HTMLElement | null;
    // Focus moved to a sibling segment — don't validate yet
    if (rel && (rel === dayRef.current || rel === monRef.current || rel === yrRef.current)) return;

    const d = dayRef.current?.value ?? "";
    const m = monRef.current?.value ?? "";
    const y = yrRef.current?.value ?? "";

    if (!d && !m && !y) {
      lastValid.current = "";
      setDraft("");
      setError("");
      return;
    }

    // Clamp out-of-range values before validating
    if (dayRef.current && d && Number(d) > 31) dayRef.current.value = "31";
    if (dayRef.current && d && Number(d) < 1) dayRef.current.value = "01";
    if (monRef.current && m && Number(m) > 12) monRef.current.value = "12";
    if (monRef.current && m && Number(m) < 1) monRef.current.value = "01";

    const ymd = fromDMY(
      `${dayRef.current?.value ?? ""}/${monRef.current?.value ?? ""}/${yrRef.current?.value ?? ""}`,
    );

    if (ymd) {
      lastValid.current = ymd;
      setDraft(ymd);
      setError("");
      syncSegs(ymd, dayRef, monRef, yrRef);
    } else if (lastValid.current) {
      syncSegs(lastValid.current, dayRef, monRef, yrRef);
      setDraft(lastValid.current);
      setError("");
    } else {
      const d2 = dayRef.current?.value ?? "";
      const m2 = monRef.current?.value ?? "";
      const y2 = yrRef.current?.value ?? "";
      setError(d2 && m2 && y2 ? "Invalid date" : "Incomplete date");
    }
  };

  const handlePresetFilter = (filter: FilterType) => {
    const r = resolveFilterToRange(filter, new Date());
    const fromYmd = dateToYMD(r.start);
    const toYmd = dateToYMD(r.end);
    lastValidFrom.current = fromYmd;
    lastValidTo.current = toYmd;
    setDraftFrom(fromYmd);
    setDraftTo(toYmd);
    setFromError("");
    setToError("");
    syncSegs(fromYmd, fromDayRef, fromMonRef, fromYrRef);
    syncSegs(toYmd, toDayRef, toMonRef, toYrRef);
  };

  const handleApplyClick = () => {
    const from = readYmd(fromDayRef, fromMonRef, fromYrRef) || draftFrom;
    const to = readYmd(toDayRef, toMonRef, toYrRef) || draftTo;
    if (!from || !to || from > to) return;
    onApply(from, to);
    setAnchorEl(null);
  };

  const segInputStyle: React.CSSProperties = {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "0.85rem",
    color: "#333",
    fontFamily: "inherit",
    width: "28px",
    textAlign: "center",
    padding: 0,
    letterSpacing: "0.02em",
  };

  const slashStyle: React.CSSProperties = {
    color: "#bbb",
    fontSize: "0.9rem",
    userSelect: "none",
    lineHeight: 1,
    flexShrink: 0,
  };

  const renderDateInput = (
    dayRef: InputRef,
    monRef: InputRef,
    yrRef: InputRef,
    setDraft: (v: string) => void,
    setError: (v: string) => void,
    lastValid: StringRef,
    error: string,
  ) => (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          border: `1px solid ${error ? "#d32f2f" : "#e0e0e0"}`,
          borderRadius: "8px",
          padding: "7px 8px",
          background: error ? "#fff8f8" : "#fafafa",
          boxSizing: "border-box",
          gap: "2px",
          transition: "border-color 0.15s, background 0.15s",
          "&:focus-within": { borderColor: error ? "#d32f2f" : "#aaa" },
        }}
      >
        <input
          ref={dayRef}
          type="text"
          inputMode="numeric"
          placeholder="DD"
          maxLength={2}
          onChange={(e) =>
            handleSegInput(e, "day", monRef, dayRef, monRef, yrRef, setDraft, setError, lastValid)
          }
          onKeyDown={(e) => handleSegKeyDown(e, null)}
          onBlur={(e) => handleSegBlur(e, dayRef, monRef, yrRef, setDraft, setError, lastValid)}
          style={segInputStyle}
        />
        <span style={slashStyle}>/</span>
        <input
          ref={monRef}
          type="text"
          inputMode="numeric"
          placeholder="MM"
          maxLength={2}
          onChange={(e) =>
            handleSegInput(e, "mon", yrRef, dayRef, monRef, yrRef, setDraft, setError, lastValid)
          }
          onKeyDown={(e) => handleSegKeyDown(e, dayRef)}
          onBlur={(e) => handleSegBlur(e, dayRef, monRef, yrRef, setDraft, setError, lastValid)}
          style={segInputStyle}
        />
        <span style={slashStyle}>/</span>
        <input
          ref={yrRef}
          type="text"
          inputMode="numeric"
          placeholder="YY"
          maxLength={2}
          onChange={(e) =>
            handleSegInput(e, "yr", null, dayRef, monRef, yrRef, setDraft, setError, lastValid)
          }
          onKeyDown={(e) => handleSegKeyDown(e, monRef)}
          onBlur={(e) => handleSegBlur(e, dayRef, monRef, yrRef, setDraft, setError, lastValid)}
          style={segInputStyle}
        />
      </Box>
      {error && (
        <Typography sx={{ fontSize: "0.65rem", color: "#d32f2f", mt: 0.4, lineHeight: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.8,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          px: 1.5,
          py: 0.7,
          bgcolor: "#fff",
          cursor: "pointer",
          userSelect: "none",
          "&:hover": { borderColor: "#bbb", bgcolor: "#fafafa" },
        }}
      >
        <CalendarTodayIcon sx={{ fontSize: 14, color: "#E8490F" }} />
        <Typography sx={{ fontSize: "0.8rem", color: "#333", fontWeight: 600 }}>
          {formatDate(appliedFrom)} – {formatDate(appliedTo)}
        </Typography>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              mt: 1,
              width: 320,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              overflow: "hidden",
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2.5, pt: 2, pb: 1.5, borderBottom: "1px solid #f0f0f0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <CalendarTodayIcon sx={{ fontSize: 15, color: "#E8490F" }} />
            <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#1a1a2e" }}>
              Date Range
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#aaa", mt: 0.3 }}>
            Today: {formatDate(todayYMD)}
          </Typography>
        </Box>

        {/* Presets */}
        <Box sx={{ px: 2.5, pt: 1.5, pb: 1, display: "flex", gap: 0.8, flexWrap: "wrap" }}>
          {PRESET_OPTIONS.map((p) => {
            const r = resolveFilterToRange(p.value, new Date());
            const isActive =
              draftFrom === dateToYMD(r.start) && draftTo === dateToYMD(r.end);
            return (
              <Box
                key={p.value}
                onClick={() => handlePresetFilter(p.value)}
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  px: 1.2,
                  py: 0.4,
                  borderRadius: 5,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "#E8490F" : "#e0e0e0",
                  color: isActive ? "#E8490F" : "#666",
                  bgcolor: isActive ? "#fff4f0" : "#fafafa",
                  "&:hover": { borderColor: "#E8490F", color: "#E8490F", bgcolor: "#fff4f0" },
                }}
              >
                {p.label}
              </Box>
            );
          })}
        </Box>

        {/* Date inputs */}
        <Box sx={{ px: 2.5, pt: 0.5, pb: rangeError ? 0.5 : 2, display: "flex", gap: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#aaa",
                fontWeight: 600,
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              From
            </Typography>
            {renderDateInput(
              fromDayRef, fromMonRef, fromYrRef,
              setDraftFrom, setFromError, lastValidFrom, fromError,
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#aaa",
                fontWeight: 600,
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              To
            </Typography>
            {renderDateInput(
              toDayRef, toMonRef, toYrRef,
              setDraftTo, setToError, lastValidTo, toError,
            )}
          </Box>
        </Box>

        {/* Range error message */}
        {rangeError && (
          <Typography
            sx={{ fontSize: "0.7rem", color: "#d32f2f", px: 2.5, pb: 1.5, lineHeight: 1 }}
          >
            {rangeError}
          </Typography>
        )}

        {/* Actions */}
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            bgcolor: "#fafafa",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
          }}
        >
          <Button
            size="small"
            onClick={() => setAnchorEl(null)}
            sx={{ textTransform: "none", fontSize: "0.8rem", color: "#888", borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            disableElevation
            onClick={handleApplyClick}
            disabled={applyDisabled}
            sx={{
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              bgcolor: "#E8490F",
              "&:hover": { bgcolor: "#c93d0c" },
              "&.Mui-disabled": { bgcolor: "#f5c5b0", color: "#fff" },
              borderRadius: 1.5,
              px: 2,
            }}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default ReportsDateRangePicker;
