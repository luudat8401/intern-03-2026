import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { login as loginUser } from "../../service/authService";
import { useAuth } from "../../context/AuthContext";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema as schema } from '../../schemas/auth.schema';
import { loginStyles as s } from './Login.styles';

import {
  Box, Typography, Button,
  Alert, Link, Divider, Stack, CssBaseline
} from "@mui/material";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import GoogleIcon from '@mui/icons-material/Google';
import AuthTextField from './components/AuthTextField';
import AuthSubmitButton from './components/AuthSubmitButton';

export default function Login() {
  const [generalError, setGeneralError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    reValidateMode: 'onBlur',
    defaultValues: { username: "", password: "" },
  });
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const onSubmit = async (data) => {
    try {
      setGeneralError("");
      const resp = await loginUser(data.username, data.password);
      await loginContext(resp);
      navigate("/");
    } catch (error) {
      setGeneralError("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <Box sx={s.container}>
      <CssBaseline />

      {/* CỘT TRÁI */}
      <Box sx={s.leftPanel}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, opacity: 0.9 }}>
          Architectural Ledger
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: '800', lineHeight: 1.1, mb: 4 }}>
          Manage property <br /> with editorial <br /> precision.
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 450, mb: 6, opacity: 0.8, fontSize: '1.1rem' }}>
          The Architectural Ledger provides a high-trust, balanced environment for modern rental management.
        </Typography>
        <Stack direction="row" spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
            <VerifiedUserIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>ENTERPRISE GRADE</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
            <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>SECURE PROTOCOL</Typography>
          </Box>
        </Stack>
      </Box>

      {/* CỘT PHẢI */}
      <Box sx={s.rightPanel}>
        <Box sx={s.formWrapper}>
          <Typography variant="h4" sx={{ fontWeight: '700', mb: 1, color: '#fff' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255,255,255,0.6)' }}>
            Access your management portal
          </Typography>

          {generalError && <Alert severity="error" sx={{ mb: 3 }}>{generalError}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <AuthTextField
              label="Email Address"
              darkMode
              id="username"
              placeholder="name@company.com"
              autoComplete="username" autoFocus
              sx={s.textField}
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <AuthTextField
              label="Password"
              darkMode
              type="password"
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              sx={{ ...s.textField, mb: 1 }}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Link href="#" variant="caption" sx={{ color: '#1976d2', fontWeight: 'bold', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </Box>

            <AuthSubmitButton
              isSubmitting={isSubmitting}
              label="Login"
              loadingLabel="Processing..."
              sx={{ mb: 4, bgcolor: '#1976d2' }}
            />

            <Divider sx={s.divider}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', px: 1, color: 'rgba(255,255,255,0.4)' }}>
                Or continue with
              </Typography>
            </Divider>

            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} sx={s.socialButton}>
                Google
              </Button>
            </Stack>

            <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register" sx={{ color: '#1976d2', fontWeight: 'bold', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box sx={s.footer}>
          <Typography variant="caption" sx={{ color: '#fff' }}>PRIVACY POLICY</Typography>
          <Typography variant="caption" sx={{ color: '#fff' }}>TERMS OF SERVICE</Typography>
          <Typography variant="caption" sx={{ color: '#fff' }}>SUPPORT</Typography>
        </Box>
      </Box>

    </Box>
  );
}