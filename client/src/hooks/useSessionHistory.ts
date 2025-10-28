import { useState, useEffect, useCallback } from 'react';

export interface Session {
  id: string;
  startTime: number;
  duration: number;
  completedAt: number;
}

const HISTORY_KEY = 'hemodialysis_session_history';

export function useSessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load session history:', e);
    }
  }, []);

  const addSession = useCallback((session: Omit<Session, 'id' | 'completedAt'>) => {
    const newSession: Session = {
      ...session,
      id: crypto.randomUUID(),
      completedAt: Date.now(),
    };

    setSessions(prev => {
      const updatedSessions = [newSession, ...prev];
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedSessions));
      } catch (e) {
        console.error('Failed to save session history:', e);
      }
      return updatedSessions;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear session history:', e);
    }
  }, []);

  return { sessions, addSession, clearHistory };
}
