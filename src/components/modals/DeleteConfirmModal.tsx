import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/stores/store";
import { deleteRider } from "../../redux/sagas/riderManagement/deleteRiderAction";
import { resetDelete } from "../../redux/slices/riderDetailSlice";
import { Box, Typography, Button, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  riderName: string;
  riderId: string;
}

const DeleteConfirmModal = ({ open, onClose, riderName, riderId }: DeleteConfirmModalProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deleteLoading, deleteError, deleteSuccess } = useSelector(
    (state: RootState) => state.riderDetail,
  );

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(resetDelete());
      onClose();
      navigate("/riders");
    }
  }, [deleteSuccess]);

  const handleClose = () => {
    if (deleteLoading) return;
    dispatch(resetDelete());
    onClose();
  };

  const handleConfirm = () => {
    dispatch(deleteRider({ riderId }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      sx={{ "& .MuiDialog-paper": { width: 400, borderRadius: 3, overflow: "hidden", m: 2 } }}
    >
      <Box
        sx={{
          bgcolor: "#7f1d1d", px: 2.5, py: 2,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 34, height: 34, borderRadius: 1.5,
              bgcolor: "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <DeleteForeverIcon sx={{ fontSize: 17, color: "#fca5a5" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
              Delete Account
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", mt: 0.2 }}>
              This action cannot be undone.
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small" onClick={handleClose} disabled={deleteLoading}
          sx={{
            color: "rgba(255,255,255,0.55)", bgcolor: "rgba(255,255,255,0.08)",
            width: 28, height: 28, "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
        <Typography sx={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>
          Are you sure you want to permanently delete <strong>{riderName}</strong>'s account? All associated data including trips, documents, and earnings will be removed.
        </Typography>
        {deleteError && (
          <Typography sx={{ fontSize: "0.74rem", color: "#dc2626", mt: 1.5 }}>
            {deleteError}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1.5, px: 2.5, py: 2, borderTop: "1px solid #f3f4f6" }}>
        <Button
          fullWidth onClick={handleClose} disabled={deleteLoading}
          sx={{
            textTransform: "none", fontWeight: 600, fontSize: "0.85rem",
            color: "#374151", border: "1px solid #e5e7eb", borderRadius: 2, py: 1,
            "&:hover": { bgcolor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth variant="contained" disableElevation
          disabled={deleteLoading} onClick={handleConfirm}
          startIcon={<DeleteForeverIcon sx={{ fontSize: "16px !important" }} />}
          sx={{
            textTransform: "none", fontWeight: 600, fontSize: "0.85rem",
            bgcolor: "#dc2626", borderRadius: 2, py: 1,
            "&:hover": { bgcolor: "#b91c1c" },
            "&.Mui-disabled": { bgcolor: "#fecaca", color: "#fff" },
          }}
        >
          {deleteLoading ? "Deleting..." : "Confirm Delete"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmModal;
