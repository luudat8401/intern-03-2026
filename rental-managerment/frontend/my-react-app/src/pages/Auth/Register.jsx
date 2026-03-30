import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { register as registerUser } from "../../service/authService";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema as schema } from '../../schemas/auth.schema';
import { registerStyles as s } from './Register.styles';

import {
  Container, Box, Typography,
  Alert, Paper, Link, CssBaseline,
  ToggleButtonGroup, ToggleButton, Divider
} from "@mui/material";

// Components dùng chung
import AuthTextField from './components/AuthTextField';
import AuthSubmitButton from './components/AuthSubmitButton';
import AuthToast from './components/AuthToast';

export default function Register() {
  const [generalError, setGeneralError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    reValidateMode: 'onBlur',
    defaultValues: { username: "", password: "", role: "user" },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setGeneralError("");
      await registerUser(data.username, data.password, data.role);
      setSuccessOpen(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      setGeneralError("Đăng ký thất bại! Tên đăng nhập có thể đã tồn tại.");
    }
  };

  return (
    <Box sx={s.page}>
      <CssBaseline />

      <AuthToast
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message=" Đăng ký thành công! Đang chuyển hướng..."
      />
      <Container maxWidth="sm">
        {/* Tiêu đề */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={s.pageTitle}>REGISTER ACCOUNT</Typography>
          <Typography variant="body2" color="text.secondary">
            Elevating the standard of property management.
          </Typography>
        </Box>

        {/* Card form */}
        <Paper elevation={0} sx={s.card}>
          <Typography variant="h5" sx={{ fontWeight: '700', mb: 1 }}>Create an account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Join the elite network of property professionals.
          </Typography>

          {generalError && <Alert severity="error" sx={{ mb: 3 }}>{generalError}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* Toggle Tenant / Landlord */}
            <Box sx={{ mb: 4 }}>
              <Controller
                name="role" control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    {...field} exclusive fullWidth
                    onChange={(e, val) => val && field.onChange(val)}
                    sx={s.toggleGroup}
                  >
                    <ToggleButton value="user" sx={s.toggleButtonSelected}>Tenant</ToggleButton>
                    <ToggleButton value="master" sx={s.toggleButtonSelected}>Landlord</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Box>

            <AuthTextField
              label="EMAIL ADDRESS"
              placeholder="evelyn.h@archledger.com"
              sx={{ ...s.textField, mb: 3 }}
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <AuthTextField
              label="PASSWORD"
              type="password"
              placeholder="••••••••••••"
              sx={{ ...s.textField, mb: 3 }}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <AuthSubmitButton
              isSubmitting={isSubmitting}
              label="Sign Up"
              sx={s.submitButton}
            />

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body2" align="center" color="text.secondary">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" sx={{ color: '#1976d2', fontWeight: 'bold', textDecoration: 'none' }}>
                Login to Dashboard
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={s.pageFooter}>
          <Typography variant="caption" sx={s.footerText}>SECURE ENCRYPTION</Typography>
          <Typography variant="caption" sx={s.footerText}>PRIVACY FOCUSED</Typography>
          <Typography variant="caption" sx={s.footerText}>TIER ONE SUPPORT</Typography>
        </Box>

      </Container>
    </Box>
  );
}
