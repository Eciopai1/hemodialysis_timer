import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimerControlsProps {
  isRunning: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onExit: () => void;
}

export function TimerControls({
  isRunning,
  onPlay,
  onPause,
  onReset,
  onExit,
}: TimerControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-4 w-full max-w-md"
    >
      {/* Play/Pause Button */}
      <div className="flex gap-4">
        {!isRunning ? (
          <Button
            onClick={onPlay}
            size="lg"
            className="flex-1 h-16 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            <Play className="w-6 h-6 mr-2" />
            Iniciar
          </Button>
        ) : (
          <Button
            onClick={onPause}
            size="lg"
            className="flex-1 h-16 text-lg font-semibold bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg"
          >
            <Pause className="w-6 h-6 mr-2" />
            Pausar
          </Button>
        )}

        {/* Reset Button */}
        <Button
          onClick={onReset}
          size="lg"
          variant="outline"
          className="h-16 px-6 border-2"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
      </div>

      {/* Exit Button */}
      <Button
        onClick={onExit}
        variant="ghost"
        className="h-12 text-base text-muted-foreground hover:text-foreground"
      >
        <X className="w-5 h-5 mr-2" />
        Voltar
      </Button>
    </motion.div>
  );
}
