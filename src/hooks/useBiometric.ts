import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";

export function useBiometric() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then((has) => {
      if (has) {
        LocalAuthentication.isEnrolledAsync().then(setIsAvailable);
      }
    });
  }, []);

  const authenticate = async (): Promise<boolean> => {
    if (!isAvailable) return true; // Skip if no biometric

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Verificá tu identidad",
      cancelLabel: "Cancelar",
      fallbackLabel: "Usar contraseña",
      disableDeviceFallback: false,
    });

    return result.success;
  };

  return { isAvailable, authenticate };
}
