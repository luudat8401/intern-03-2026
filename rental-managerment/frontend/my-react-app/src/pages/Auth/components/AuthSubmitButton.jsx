import { Button } from "@mui/material";

export default function AuthSubmitButton({
  isSubmitting,
  label,
  sx = {},
}) {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      disabled={isSubmitting}
      sx={{
        py: 1.5,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "1rem",
        ...sx,
      }}
    >
      {label}
    </Button>
  );
}
