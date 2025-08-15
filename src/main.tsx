import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { initializeMobileApp } from './utils/mobile.ts'
import './index.css'

// Initialize mobile-specific features
initializeMobileApp().then(() => {
  console.log('Mobile app initialized');
}).catch((error) => {
  console.warn('Mobile initialization failed:', error);
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
