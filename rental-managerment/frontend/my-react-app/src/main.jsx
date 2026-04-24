import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LoadingProvider } from './context/LoadingContext.jsx'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AxiosInterceptor } from './components/Guards/AxiosInterceptorSetup'; 

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const theme = createTheme({
  typography: {
    fontFamily: '"Libre Franklin", "Outfit", sans-serif',
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        <AuthProvider>
          {/* <AxiosInterceptor> */}
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <App />
            </GoogleOAuthProvider>
          {/* </AxiosInterceptor> */}
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  </StrictMode>
)
