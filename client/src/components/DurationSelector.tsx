import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

interface DurationSelectorProps {
  onSelect: (durationMs: number) => void;
}

export function DurationSelector({ onSelect }: DurationSelectorProps) {
  const [hours, setHours] = useState(4);
  const [minutes, setMinutes] = useState(0);

  const handleStart = () => {
    const totalMs = (hours * 60 + minutes) * 60 * 1000;
    onSelect(totalMs);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800"
    >
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Hemodiálise Timer
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-md">
          Selecione a duração da sua sessão de hemodiálise
        </p>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Duração da Sessão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <span className="text-5xl font-bold tabular-nums">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-medium">Horas: {hours}</label>
              <Slider
                value={[hours]}
                onValueChange={([val]) => setHours(val)}
                min={0}
                max={8}
                step={1}
              />
            </div>
            <div>
              <label className="font-medium">Minutos: {minutes}</label>
              <Slider
                value={[minutes]}
                onValueChange={([val]) => setMinutes(val)}
                min={0}
                max={55}
                step={5}
              />
            </div>
          </div>
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full text-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            Iniciar Sessão
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground max-w-md mt-8">
        <p>
          O temporizador continuará funcionando mesmo com a tela do seu telefone desligada.
        </p>
      </div>
    </motion.div>
  );
}
