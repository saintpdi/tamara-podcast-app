import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network } from '@capacitor/network';

export const isMobile = () => {
  return Capacitor.isNativePlatform();
};

export const isAndroid = () => {
  return Capacitor.getPlatform() === 'android';
};

export const isIOS = () => {
  return Capacitor.getPlatform() === 'ios';
};

export const initializeMobileApp = async () => {
  if (!isMobile()) return;

  try {
    // Set status bar style
    await StatusBar.setStyle({ style: Style.Dark });
    
    // Hide splash screen after app is ready
    setTimeout(async () => {
      await SplashScreen.hide();
    }, 2000);

    // Setup keyboard listeners
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
    });

  } catch (error) {
    console.warn('Mobile initialization error:', error);
  }
};

export const triggerHapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
  if (!isMobile()) return;
  
  try {
    await Haptics.impact({ style });
  } catch (error) {
    console.warn('Haptic feedback error:', error);
  }
};

export const checkNetworkStatus = async () => {
  try {
    const status = await Network.getStatus();
    return status;
  } catch (error) {
    console.warn('Network status error:', error);
    return { connected: true, connectionType: 'unknown' };
  }
};

export const addNetworkListener = (callback: (status: any) => void) => {
  if (!isMobile()) return;
  
  return Network.addListener('networkStatusChange', callback);
};

export const safeAreaInsets = () => {
  if (!isMobile()) return { top: 0, bottom: 0, left: 0, right: 0 };
  
  // Get safe area insets for notched devices
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0'),
    bottom: parseInt(style.getPropertyValue('--sab') || '0'),
    left: parseInt(style.getPropertyValue('--sal') || '0'),
    right: parseInt(style.getPropertyValue('--sar') || '0'),
  };
};

// Helper function to open external URLs in system browser
export const openExternalUrl = async (url: string) => {
  if (isMobile()) {
    // Import dynamically to avoid errors on web
    const { Browser } = await import('@capacitor/browser');
    await Browser.open({ url });
  } else {
    window.open(url, '_blank');
  }
};
