import { Snackbar, Alert } from "@mui/material";

export default function AuthToast({
  open,
  onClose,
  message,
  severity = "success",
  duration = 2500,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", fontWeight: "bold", fontSize: "0.95rem", boxShadow: 4 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
