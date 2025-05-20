
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TimerControlsProps {
  onScheduledPost: () => void;
  disabled: boolean;
}

const TimerControls = ({ onScheduledPost, disabled }: TimerControlsProps) => {
  const [isScheduleActive, setIsScheduleActive] = useState(false);
  const [nextPostTime, setNextPostTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  useEffect(() => {
    let countdown: NodeJS.Timeout | null = null;
    
    if (isScheduleActive && nextPostTime) {
      countdown = setInterval(() => {
        const now = new Date();
        const diff = nextPostTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          // Tempo acabou, fazer postagem
          handlePostNow();
          return;
        }
        
        // Atualizar contador regressivo
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    
    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [isScheduleActive, nextPostTime]);

  // Gera um tempo aleatório entre 1 e 2 horas
  const scheduleRandomPost = () => {
    // Entre 1 e 2 horas (em milissegundos)
    const minTime = 60 * 60 * 1000; // 1 hora
    const maxTime = 120 * 60 * 1000; // 2 horas
    
    // Para teste/demonstração: usar entre 30 segundos e 2 minutos
    // const minTime = 30 * 1000; // 30 segundos
    // const maxTime = 120 * 1000; // 2 minutos
    
    const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    
    const nextTime = new Date(Date.now() + randomTime);
    setNextPostTime(nextTime);
    
    // Formatar para exibição
    const hours = nextTime.getHours().toString().padStart(2, '0');
    const minutes = nextTime.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    toast({
      title: "Postagem agendada",
      description: `Próxima postagem programada para ${timeString}`,
    });
    
    return randomTime;
  };

  const handleToggleSchedule = () => {
    if (!isScheduleActive) {
      // Ativando o agendamento
      const randomTime = scheduleRandomPost();
      setTimerInterval(randomTime);
      setIsScheduleActive(true);
    } else {
      // Desativando o agendamento
      setIsScheduleActive(false);
      setNextPostTime(null);
      setTimeRemaining("");
      setTimerInterval(null);
      toast({
        title: "Agendamento desativado",
        description: "O agendamento automático foi desativado"
      });
    }
  };

  const handlePostNow = () => {
    onScheduledPost();
    
    // Se ainda estiver ativo, agendar próxima postagem
    if (isScheduleActive) {
      const randomTime = scheduleRandomPost();
      setTimerInterval(randomTime);
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-medium text-lg">Agendamento Automático</h3>
          <p className="text-sm text-muted-foreground">
            Posta automaticamente em intervalos de 1-2 horas
          </p>
        </div>
        <Switch
          disabled={disabled}
          checked={isScheduleActive}
          onCheckedChange={handleToggleSchedule}
        />
      </div>
      
      {isScheduleActive && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Próxima postagem em:</span>
            </div>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {timeRemaining}
            </span>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handlePostNow}
            disabled={disabled}
          >
            Postar agora
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimerControls;
