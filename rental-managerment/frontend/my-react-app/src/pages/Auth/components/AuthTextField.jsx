import { Box, Typography, TextField } from "@mui/material";

export default function AuthTextField({ label, labelRight, darkMode = false, sx = {}, ...props }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: darkMode ? "rgba(255,255,255,0.8)" : "text.secondary",
          }}
        >
          {label}
        </Typography>
        {labelRight && labelRight}
      </Box>
      <TextField fullWidth variant="filled" hiddenLabel sx={sx} {...props} />
    </Box>
  );
}
