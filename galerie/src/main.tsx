import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { LangProvider } from './i18n';
import App from './App';

// Point de montage : `#gallery-root` quand la galerie est embarquée dans une page
// hôte (site ereyes), sinon `#root` en mode autonome (dev/preview).
const mount = document.getElementById('gallery-root') ?? document.getElementById('root');

createRoot(mount!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LangProvider>
        <App />
      </LangProvider>
    </ThemeProvider>
  </StrictMode>,
);
