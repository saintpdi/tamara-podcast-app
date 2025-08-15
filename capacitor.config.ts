
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tamara.podcast',
  appName: 'Tamara Podcast',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ec4899",
      showSpinner: true,
      spinnerColor: "#ffffff"
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#ec4899"
    }
  }
};

export default config;
