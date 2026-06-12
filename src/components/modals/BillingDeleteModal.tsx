import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DeleteOutlined as DeleteOutlinedIcon } from "@mui/icons-material";

interface BillingDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const BillingDeleteModal = ({ open, onClose, onConfirm }: BillingDeleteModalProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
    <DialogTitle sx={{ pb: 0.5, pt: 2.5, px: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: "#fff1f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <DeleteOutlinedIcon sx={{ fontSize: 15, color: "#ed3333" }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>Delete Record</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#6b7280", "&:hover": { bgcolor: "#f3f4f6" } }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent sx={{ px: 3, pt: "12px !important" }}>
      <Typography sx={{ fontSize: "0.85rem", color: "#374151" }}>
        This will permanently remove this payment record. This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, display: "flex", gap: 1 }}>
      <Button onClick={onClose}
        sx={{ textTransform: "none", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 2, px: 2.5, fontSize: "0.85rem", "&:hover": { bgcolor: "#f9fafb" } }}
      >
        Cancel
      </Button>
      <Box sx={{ flex: 1 }} />
      <Button onClick={onConfirm} variant="contained" disableElevation
        startIcon={<DeleteOutlinedIcon sx={{ fontSize: "16px !important" }} />}
        sx={{ textTransform: "none", bgcolor: "#ed3333", color: "#fff", fontWeight: 600, borderRadius: 2, px: 2.5, fontSize: "0.85rem", "&:hover": { bgcolor: "#c62828" } }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default BillingDeleteModal;
