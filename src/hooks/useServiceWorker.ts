import { useState, useEffect } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isControlling: boolean;
  registration: ServiceWorkerRegistration | null;
  error: string | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isControlling: false,
    registration: null,
    error: null
  });

  useEffect(() => {
    if (!state.isSupported) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration,
          isInstalling: registration.installing !== null,
          isWaiting: registration.waiting !== null,
          isControlling: registration.active !== null
        }));

        // Listen for service worker state changes
        if (registration.installing) {
          registration.installing.addEventListener('statechange', () => {
            setState(prev => ({
              ...prev,
              isInstalling: registration.installing !== null,
              isWaiting: registration.waiting !== null,
              isControlling: registration.active !== null
            }));
          });
        }

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          setState(prev => ({
            ...prev,
            isInstalling: true
          }));
        });

      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Service worker registration failed'
        }));
      }
    };

    registerServiceWorker();
  }, [state.isSupported]);

  const updateServiceWorker = () => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const unregisterServiceWorker = async () => {
    if (state.registration) {
      await state.registration.unregister();
      setState(prev => ({
        ...prev,
        isRegistered: false,
        registration: null
      }));
    }
  };

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker
  };
}