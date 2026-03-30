export const loginStyles = {
  // Layout chính
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },

  // Cột trái (nền xanh)
  leftPanel: {
    flex: 1,
    backgroundColor: '#1976d2',
    display: { xs: 'none', sm: 'flex' },
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white',
    px: { sm: 4, md: 10 },
  },

  // Cột phải (nền tối)
  rightPanel: {
    flex: 1,
    bgcolor: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Khung chứa form
  formWrapper: {
    maxWidth: 400,
    width: '100%',
    px: 4,
  },

  // Input Email / Password
  textField: {
    mb: 3,
    '& .MuiFilledInput-root': {
      bgcolor: 'rgba(255,255,255,0.08)',
      color: '#fff',
      '&:before, &:after': { display: 'none' },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'rgba(255,255,255,0.4)',
      opacity: 1,
    },
  },

  // Divider "Or continue with"
  divider: {
    mb: 4,
    '&::before, &::after': { borderColor: 'rgba(255,255,255,0.15)' },
  },

  // Nút Google
  socialButton: {
    textTransform: 'none',
    color: '#fff',
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // Footer bám đáy
  footer: {
    position: 'absolute',
    bottom: 32,
    display: 'flex',
    gap: 3,
    opacity: 0.5,
  },
};
