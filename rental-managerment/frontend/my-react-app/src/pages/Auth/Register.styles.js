export const registerStyles = {
  // Trang nền ngoài
  page: {
    bgcolor: '#f8fafc',
    minHeight: '100vh',
    py: 8,
  },

  // Tiêu đề trên cùng
  pageTitle: {
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Card chứa form
  card: {
    p: { xs: 4, md: 6 },
    borderRadius: 4,
    border: '1px solid #e2e8f0',
  },

  // Toggle chọn vai trò (Tenant / Landlord)
  toggleGroup: {
    bgcolor: '#f1f5f9',
    p: 0.5,
    borderRadius: 2,
    '& .MuiToggleButton-root': {
      border: 'none',
      borderRadius: 1.5,
      py: 1,
      textTransform: 'none',
      fontWeight: '600',
    },
  },

  // Mỗi toggle button khi được chọn
  toggleButtonSelected: {
    '&.Mui-selected': {
      bgcolor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      color: '#1976d2',
    },
  },

  // Label caption trên mỗi field
  fieldLabel: {
    fontWeight: 'bold',
    mb: 1,
    display: 'block',
    color: 'text.secondary',
  },

  // Input Email / Password
  textField: {
    mb: 3,
    '& .MuiFilledInput-root': {
      bgcolor: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 2,
      '&:before, &:after': { display: 'none' },
    },
  },

  // Nút Sign Up
  submitButton: {
    py: 1.5,
    bgcolor: '#1976d2',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    borderRadius: 2,
    mb: 4,
  },

  // Dòng footer dưới card
  pageFooter: {
    mt: 6,
    display: 'flex',
    justifyContent: 'space-between',
    opacity: 0.4,
  },

  footerText: {
    fontWeight: '700',
  },
};
