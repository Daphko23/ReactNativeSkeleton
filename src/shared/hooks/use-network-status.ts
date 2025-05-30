import {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Hook zum Prüfen und Überwachen des Netzwerkstatus
 *
 * @returns Objekt mit isConnected-Flag
 */
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    // Initialer Check
    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(!!state.isConnected);
    };

    checkConnection();

    // Listener für Änderungen
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {isConnected};
};
