import { useSessionHistory, Session } from '@/hooks/useSessionHistory';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, History } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function SessionHistory() {
  const { sessions, clearHistory } = useSessionHistory();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="absolute top-4 left-4">
          <History className="w-6 h-6 mr-2" />
          Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Histórico de Sessões</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma sessão registrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Horário de Início</TableHead>
                  <TableHead>Horário de Término</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session: Session) => (
                  <TableRow key={session.id}>
                    <TableCell>{new Date(session.completedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{formatDuration(session.duration)}</TableCell>
                    <TableCell>{new Date(session.startTime).toLocaleTimeString()}</TableCell>
                    <TableCell>{new Date(session.completedAt).toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {sessions.length > 0 && (
          <div className="mt-6 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Histórico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá apagar permanentemente todo o seu histórico de sessões.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
