import { useState, useEffect, useRef } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { DurationSelector } from '@/components/DurationSelector';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TimerControls } from '@/components/TimerControls';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { SessionHistory } from '@/components/SessionHistory';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  if (!toggleTheme) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="absolute top-4 right-4"
    >
      {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
    </Button>
  );
}

export default function Home() {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const timer = useTimer();
  const { addSession } = useSessionHistory();
  const sessionSavedRef = useRef(false);

  // Salvar sessão ao concluir
  useEffect(() => {
    if (timer.remaining === 0 && timer.totalDuration && !sessionSavedRef.current) {
      addSession({
        startTime: Date.now() - timer.totalDuration,
        duration: timer.totalDuration,
      });
      sessionSavedRef.current = true; // Evitar salvar múltiplas vezes
    }
  }, [timer.remaining, timer.totalDuration, addSession]);

  // Restaurar estado ao carregar
  useEffect(() => {
    const saved = localStorage.getItem('timerState');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        const timePassed = Date.now() - state.savedAt;
        const newElapsed = state.elapsed + timePassed;
        const remaining = Math.max(0, state.totalDuration - newElapsed);

        if (state.totalDuration && remaining > 0) {
          setSelectedDuration(state.totalDuration);
          // Restaurar o temporizador
          timer.start(state.totalDuration);
          if (state.isRunning) {
            // Já está rodando no worker
          } else {
            timer.pause();
          }
        }
      } catch (e) {
        console.error('Erro ao restaurar estado:', e);
      }
    }
  }, []);

  const handleSelectDuration = (duration: number) => {
    setSelectedDuration(duration);
    timer.start(duration);
    sessionSavedRef.current = false; // Resetar para a nova sessão
  };

  const handleExit = () => {
    timer.reset();
    setSelectedDuration(null);
    localStorage.removeItem('timerState');
  };

  if (!selectedDuration) {
    return (
      <>
        <SessionHistory />
        <ThemeToggleButton />
        <DurationSelector onSelect={handleSelectDuration} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 py-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <SessionHistory />
      <ThemeToggleButton />
      <TimerDisplay remaining={timer.remaining} total={selectedDuration} />

      <TimerControls
        isRunning={timer.isRunning}
        onPlay={timer.resume}
        onPause={timer.pause}
        onReset={() => {
          timer.reset();
          timer.start(selectedDuration);
        }}
        onExit={handleExit}
      />

      {/* Notificação visual quando termina */}
      {timer.remaining === 0 && timer.totalDuration && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-2xl animate-pulse">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              ✓ Sessão Concluída!
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Sua sessão de hemodiálise foi finalizada.
            </p>
            <button
              onClick={handleExit}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
