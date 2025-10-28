import { useEffect, useRef, useState } from 'react';

interface TimerState {
  elapsed: number;
  remaining: number;
  isRunning: boolean;
  totalDuration: number | null;
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function showCompletionNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Sessão Concluída!', {
      body: 'Sua sessão de hemodiálise foi finalizada.',
      icon: '/icon.png', // Adicione um ícone se desejar
    });
  }
}

export function useTimer() {
  const [state, setState] = useState<TimerState>({
    elapsed: 0,
    remaining: 0,
    isRunning: false,
    totalDuration: null,
  });

  const workerRef = useRef<Worker | null>(null);
  const tickIntervalRef = useRef<number | null>(null);

  // Inicializar Web Worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker('/timer.worker.js');

      workerRef.current.onmessage = (event) => {
        const { type, elapsed, remaining, isRunning } = event.data;

        if (type === 'update') {
          setState((prev) => ({
            ...prev,
            elapsed,
            remaining,
            isRunning,
          }));
        } else if (type === 'finished') {
          setState((prev) => ({
            ...prev,
            isRunning: false,
          }));
          // Tocar som e mostrar notificação ao terminar
          playNotificationSound();
          showCompletionNotification();
        }
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, []);

  // Iniciar tick a cada 100ms para atualizar UI suavemente
  useEffect(() => {
    if (state.isRunning) {
      tickIntervalRef.current = window.setInterval(() => {
        if (workerRef.current) {
          workerRef.current.postMessage({ type: 'tick' });
        }
      }, 100);
    } else {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    }

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, [state.isRunning]);

  // Persistir estado em localStorage
  useEffect(() => {
    localStorage.setItem(
      'timerState',
      JSON.stringify({
        elapsed: state.elapsed,
        totalDuration: state.totalDuration,
        isRunning: state.isRunning,
        savedAt: Date.now(),
      })
    );
  }, [state.elapsed, state.totalDuration, state.isRunning]);

  const start = (durationMs: number) => {
    requestNotificationPermission(); // Solicitar permissão ao iniciar

    setState((prev) => ({
      ...prev,
      totalDuration: durationMs,
      isRunning: true,
    }));

    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'start',
        duration: durationMs,
      });
    }
  };

  const pause = () => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
    }));

    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'pause' });
    }
  };

  const resume = () => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
    }));

    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'resume' });
    }
  };

  const reset = () => {
    setState({
      elapsed: 0,
      remaining: 0,
      isRunning: false,
      totalDuration: null,
    });

    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'reset' });
    }
  };

  return {
    ...state,
    start,
    pause,
    resume,
    reset,
  };
}

function playNotificationSound() {
  // Usar Web Audio API para criar um som de notificação
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Som de 800Hz por 500ms
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);

  // Segundo beep
  setTimeout(() => {
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();

    osc2.connect(gain2);
    gain2.connect(audioContext.destination);

    osc2.frequency.value = 1000;
    osc2.type = 'sine';

    gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    osc2.start(audioContext.currentTime);
    osc2.stop(audioContext.currentTime + 0.5);
  }, 600);
}
