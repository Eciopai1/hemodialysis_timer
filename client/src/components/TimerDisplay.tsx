import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface TimerDisplayProps {
  remaining: number;
  total: number;
}

export function TimerDisplay({ remaining, total }: TimerDisplayProps) {
  const { hours, minutes, seconds } = useMemo(() => {
    const totalSeconds = Math.ceil(remaining / 1000);
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }, [remaining]);

  const progressPercentage = total > 0 ? ((total - remaining) / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-8"
    >
      {/* Circular Progress */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`}
            className="text-blue-500 transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>

        {/* Time display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl sm:text-7xl font-bold text-foreground tabular-nums">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-sm text-muted-foreground mt-2">Tempo Restante</div>
        </div>
      </div>

      {/* Progress percentage */}
      <div className="text-center">
        <motion.div
          key={Math.round(progressPercentage)}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-semibold text-foreground"
        >
          {Math.round(progressPercentage)}% Concluído
        </motion.div>
      </div>
    </motion.div>
  );
}
