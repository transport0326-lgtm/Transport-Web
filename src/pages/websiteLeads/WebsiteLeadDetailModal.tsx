import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stores/store";

type TabKey = "leads" | "enterprise" | "contact" | "career";

interface Props {
  open: boolean;
  onClose: () => void;
  tab: TabKey;
}

/* ── Field box (looks like a filled input) ──────────────────── */

interface FieldBoxProps {
  label: string;
  icon: React.ReactNode;
  value?: string | null;
  required?: boolean;
  helperText?: string;
  multiline?: boolean;
  isLink?: boolean;
  href?: string;
  onClick?: () => void;
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];

const getFileExtension = (url: string): string => {
  const clean = url.split("?")[0].split("#")[0];
  const match = clean.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : "";
};

const FieldBox: React.FC<FieldBoxProps> = ({ label, icon, value, required, helperText, multiline, isLink, href, onClick }) => (
  <Box>
    <Typography
      sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", mb: 0.75 }}
    >
      {label}
      {required && <Box component="span" sx={{ color: "#E8490F", ml: 0.25 }}>*</Box>}
    </Typography>

    <Box
      sx={{
        display: "flex", alignItems: multiline ? "flex-start" : "center",
        gap: 1.25, border: "1.5px solid #e5e7eb", borderRadius: 1.5,
        px: 1.5, py: multiline ? 1.5 : 1.2, bgcolor: "#fff",
      }}
    >
      <Box sx={{ color: "#9ca3af", flexShrink: 0, display: "flex", mt: multiline ? 0.2 : 0 }}>
        {icon}
      </Box>

      {isLink && onClick ? (
        <Box
          onClick={onClick}
          sx={{
            fontSize: "0.875rem", color: "#2563eb", fontWeight: 600, wordBreak: "break-all",
            cursor: "pointer", "&:hover": { textDecoration: "underline" },
          }}
        >
          {value || href}
        </Box>
      ) : isLink && (href ?? value) ? (
        <Box
          component="a"
          href={href ?? value ?? ""}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontSize: "0.875rem", color: "#2563eb", wordBreak: "break-all",
            textDecoration: "none", "&:hover": { textDecoration: "underline" },
          }}
        >
          {value || href}
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: value ? "#111827" : "#c9cdd4",
            lineHeight: multiline ? 1.75 : 1.4,
            wordBreak: "break-word",
            whiteSpace: multiline ? "pre-wrap" : "normal",
          }}
        >
          {value || "—"}
        </Typography>
      )}
    </Box>

    {helperText && (
      <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", mt: 0.5 }}>
        {helperText}
      </Typography>
    )}
  </Box>
);

/* ── Two-column row ──────────────────────────────────────────── */
const TwoCol: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
    {children}
  </Box>
);

/* ── Resume / document viewer dialog ────────────────────────── */
interface ResumeViewerDialogProps {
  open: boolean;
  onClose: () => void;
  url: string;
  fileName?: string;
}

const ResumeViewerDialog: React.FC<ResumeViewerDialogProps> = ({ open, onClose, url, fileName }) => {
  const ext = getFileExtension(url);
  const isImage = IMAGE_EXTENSIONS.includes(ext);
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    if (!open || !url) return;

    let objectUrl: string | null = null;
    setBlobUrl(null);
    setLoadError(false);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch file");
        return res.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => setLoadError(true));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, url]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, height: "85vh", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: 2.5, py: 1.5, borderBottom: "1px solid #e5e7eb",
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827", wordBreak: "break-all" }}>
            {fileName || "Resume / CV"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, bgcolor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "auto" }}>
          {loadError ? (
            <Typography sx={{ fontSize: "0.9rem", color: "#dc2626" }}>
              Unable to load preview.
            </Typography>
          ) : !blobUrl ? (
            <CircularProgress size={28} thickness={4} sx={{ color: "#0D1B3E" }} />
          ) : isImage ? (
            <Box
              component="img"
              src={blobUrl}
              alt={fileName || "Resume preview"}
              sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          ) : (
            <iframe
              src={blobUrl}
              title={fileName || "Resume preview"}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

/* ── Tab content ─────────────────────────────────────────────── */

const LeadsContent: React.FC<{ r: any }> = ({ r }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <TwoCol>
      <FieldBox required label="Full Name"    icon={<PersonOutlinedIcon    sx={{ fontSize: 18 }} />} value={r.name} />
      <FieldBox required label="Phone Number" icon={<PhoneAndroidIcon      sx={{ fontSize: 18 }} />} value={r.phone} />
    </TwoCol>
    <TwoCol>
      <FieldBox required label="City"          icon={<LocationOnOutlinedIcon sx={{ fontSize: 18 }} />} value={r.city ?? r.currentCity} />
      <FieldBox required label="Service Needed" icon={<AssignmentOutlinedIcon sx={{ fontSize: 18 }} />} value={r.serviceNeeded ?? r.reason} />
    </TwoCol>
    <FieldBox
      label="Notes"
      icon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
      value={r.notes ?? null}
      multiline
    />
  </Box>
);

const EnterpriseContent: React.FC<{ r: any }> = ({ r }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <TwoCol>
      <FieldBox required label="First Name"   icon={<PersonOutlinedIcon    sx={{ fontSize: 18 }} />} value={r.name} />
      <FieldBox required label="Company Name" icon={<BusinessOutlinedIcon sx={{ fontSize: 18 }} />} value={r.companyName} />
    </TwoCol>
    <TwoCol>
      <FieldBox required label="Phone Number" icon={<PhoneAndroidIcon      sx={{ fontSize: 18 }} />} value={r.phone} />
      <FieldBox required label="Work Email"   icon={<EmailOutlinedIcon    sx={{ fontSize: 18 }} />} value={r.workEmail ?? r.email} />
    </TwoCol>
    <FieldBox
      required
      label="Cities / Locations"
      icon={<LocationOnOutlinedIcon sx={{ fontSize: 18 }} />}
      value={Array.isArray(r.cities) ? r.cities.join(", ") : r.cities ?? r.city}
    />
    <TwoCol>
      <FieldBox label="Monthly Volume" icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />} value={r.monthlyVolume} />
      <FieldBox label="Vehicle Type"   icon={<DirectionsCarOutlinedIcon sx={{ fontSize: 18 }} />} value={r.vehicleType} />
    </TwoCol>
    {(r.requirement || r.message) && (
      <FieldBox
        label="Requirement / Message"
        icon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
        value={r.requirement ?? r.message}
        multiline
      />
    )}
  </Box>
);

const ContactContent: React.FC<{ r: any }> = ({ r }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <TwoCol>
      <FieldBox required label="Full Name"     icon={<PersonOutlinedIcon sx={{ fontSize: 18 }} />} value={r.name} />
      <FieldBox required label="Phone Number"  icon={<PhoneAndroidIcon   sx={{ fontSize: 18 }} />} value={r.phone} />
    </TwoCol>
    <TwoCol>
      <FieldBox required label="Email Address"   icon={<EmailOutlinedIcon      sx={{ fontSize: 18 }} />} value={r.email} />
      <FieldBox required label="Service / Subject" icon={<AssignmentOutlinedIcon sx={{ fontSize: 18 }} />} value={r.serviceNeeded ?? r.subject} />
    </TwoCol>
    {r.message && (
      <FieldBox
        required
        label="Message"
        icon={<MessageOutlinedIcon sx={{ fontSize: 18 }} />}
        value={r.message}
        multiline
      />
    )}
  </Box>
);

const CareerContent: React.FC<{ r: any }> = ({ r }) => {
  const [resumeOpen, setResumeOpen] = React.useState(false);

  const city = r.currentCity ?? r.city;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TwoCol>
        <FieldBox required label="Full Name"     icon={<PersonOutlinedIcon  sx={{ fontSize: 18 }} />} value={r.fullName ?? r.name} />
        <FieldBox required label="Email"         icon={<EmailOutlinedIcon  sx={{ fontSize: 18 }} />} value={r.email} />
      </TwoCol>
      <TwoCol>
        <FieldBox required label="Mobile / WhatsApp" icon={<WhatsAppIcon             sx={{ fontSize: 18 }} />} value={r.phone} />
        <FieldBox required label="Current City"      icon={<LocationOnOutlinedIcon  sx={{ fontSize: 18 }} />} value={city} />
      </TwoCol>
      <FieldBox
        label="LinkedIn or Portfolio URL"
        icon={<LinkedInIcon sx={{ fontSize: 18 }} />}
        value={r.portfolioUrl}
        href={r.portfolioUrl}
        isLink
      />
      <TwoCol>
        <FieldBox label="Position Applied" icon={<WorkOutlinedIcon       sx={{ fontSize: 18 }} />} value={r.position} />
        <FieldBox label="Department"       icon={<BusinessOutlinedIcon  sx={{ fontSize: 18 }} />} value={r.department} />
      </TwoCol>
      {r.resumeUrl && (
        <FieldBox
          required
          label="Resume / CV"
          icon={<AttachFileIcon sx={{ fontSize: 18 }} />}
          value={r.resumeOriginalName ?? "View Resume"}
          isLink
          onClick={() => setResumeOpen(true)}
          helperText="Click to preview the uploaded resume."
        />
      )}
      <FieldBox
        required
        label="Why Should We Hire You?"
        icon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
        value={r.whyUs}
        multiline
      />
      {r.resumeUrl && (
        <ResumeViewerDialog
          open={resumeOpen}
          onClose={() => setResumeOpen(false)}
          url={r.resumeUrl}
          fileName={r.resumeOriginalName}
        />
      )}
    </Box>
  );
};

/* ── Helpers ─────────────────────────────────────────────────── */

const modalTitle = (tab: TabKey, record: any): string => {
  if (tab === "career")    return `Application Form — ${record?.position ?? "Job Application"}`;
  if (tab === "enterprise") return `Business Quote — ${record?.companyName ?? "Enterprise Inquiry"}`;
  if (tab === "contact")    return `Contact Message — ${record?.serviceNeeded ?? "Inquiry"}`;
  return `Quote Request — ${record?.serviceNeeded ?? "Delivery Service"}`;
};

const modalSubtitle: Record<TabKey, string> = {
  leads:      "Quote request submitted for delivery service. Review the details below.",
  enterprise: "Enterprise inquiry for business delivery solutions. Review the details below.",
  contact:    "Message submitted via the contact form. Review the details below.",
  career:    "Complete application submitted by the candidate. Review the profile below.",
};

/* ── Main modal ──────────────────────────────────────────────── */

const WebsiteLeadDetailModal: React.FC<Props> = ({ open, onClose, tab }) => {
  const { data: record, loading, error } = useSelector(
    (s: RootState) => s.websiteLeadDetail,
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            m: 2,
            // borderTop: "3px solid #1e3a8a",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, bgcolor: "#fff" }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10, gap: 2 }}>
            <CircularProgress size={30} thickness={4} sx={{ color: "#0D1B3E" }} />
            <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>Loading details…</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 10, px: 3 }}>
            <Typography sx={{ fontSize: "0.9rem", color: "#dc2626", fontWeight: 600 }}>{error}</Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", mt: 0.5 }}>Please close and try again</Typography>
          </Box>
        ) : record ? (
          <Box sx={{ px: 3.5, pt: 3.5, pb: 0 }}>
            {/* Title */}
            <Typography sx={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.25, mb: 0.75 }}>
              {modalTitle(tab, record)}
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: "#6b7280", mb: 3, lineHeight: 1.5 }}>
              {modalSubtitle[tab]}
            </Typography>

            {/* Fields */}
            {tab === "leads"      && <LeadsContent      r={record} />}
            {tab === "enterprise" && <EnterpriseContent r={record} />}
            {tab === "contact"    && <ContactContent    r={record} />}
            {tab === "career"    && <CareerContent    r={record} />}
          </Box>
        ) : null}

        {/* Footer button */}
        {!loading && (
          <Box sx={{ px: 3.5, pt: 3, pb: 3.5 }}>
            <Box
              onClick={onClose}
              sx={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                cursor: "pointer", borderRadius: 2, py: 1.75,
                background: "linear-gradient(135deg, #f97316 0%, #E8490F 100%)",
                color: "#fff", fontWeight: 700, fontSize: "1rem",
                userSelect: "none",
                "&:hover": { opacity: 0.9 },
                transition: "opacity 0.15s",
              }}
            >
              Close
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WebsiteLeadDetailModal;
