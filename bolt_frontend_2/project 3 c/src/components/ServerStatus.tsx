import { useState, useEffect } from 'react';
import { Server, AlertCircle, CheckCircle } from 'lucide-react';
import { ApiService } from '../services/api';

export function ServerStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkServer = async () => {
      setChecking(true);
      try {
        const result = await ApiService.checkServerHealth();
        setIsOnline(result.online);
        setErrorMessage(result.error || null);
      } catch (error) {
        setIsOnline(false);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setChecking(false);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (checking) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <Server className="h-4 w-4 mr-2 animate-pulse" />
        Checking server...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className={`flex items-center text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        {isOnline ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Server Online
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 mr-2" />
            Server Offline
          </>
        )}
      </div>
      {!isOnline && errorMessage && (
        <div className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-200">
          <div className="font-medium mb-1">Connection Error:</div>
          <div className="whitespace-pre-line">{errorMessage}</div>
        </div>
      )}
    </div>
  );
}