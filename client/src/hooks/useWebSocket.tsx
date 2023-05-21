import { useCallback, useState } from 'react';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export default function useWebSocket<T, U>(handleMessage: (message: T) => void) {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [subject, setSubject] = useState<WebSocketSubject<any> | null>(null);

  const clearConnection = useCallback(() => {
    setSubject(null);
    setStatus(ConnectionStatus.DISCONNECTED);
  }, []);

  const createWebSocket = useCallback(
    (url: string) => {
      const subscription = webSocket<T>(url);

      setStatus(ConnectionStatus.CONNECTED);

      subscription.subscribe({
        next: handleMessage,
        // eslint-disable-next-line no-console
        error: console.error,
        complete: () => clearConnection(),
      });

      setSubject(subscription);
    },
    [clearConnection, handleMessage]
  );

  const toggleConnection = useCallback(
    (url: string) => {
      if (!subject) {
        createWebSocket(url);
      } else {
        subject.unsubscribe();
        clearConnection();
      }
    },
    [createWebSocket, clearConnection, subject]
  );

  return {
    status,
    toggleConnection,
    sendMessage: (message: U) => {
      subject?.next(message);
    },
  };
}
