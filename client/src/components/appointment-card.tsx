import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatTimeRange } from "@/lib/utils";
import type { Appointment } from "@shared/schema";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: () => void;
}

export function AppointmentCard({ appointment, onEdit }: AppointmentCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteAppointmentMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/appointments/${appointment.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Compromisso excluído",
        description: "O compromisso foi removido com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o compromisso",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este compromisso?")) {
      deleteAppointmentMutation.mutate();
    }
  };

  return (
    <div className="appointment-card group">
      <div className="flex items-start space-x-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 relative overflow-hidden group-hover:scale-110 transition-all duration-300"
             style={{ background: 'var(--secondary)' }}>
          <Users className="text-secondary-foreground w-6 h-6 relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-secondary transition-all duration-300">
            {appointment.title}
          </h3>
          {appointment.description && (
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {appointment.description}
            </p>
          )}
          <div className="flex items-center space-x-6 text-sm">
            <span className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-5 h-5 rounded-lg glass-card flex items-center justify-center">
                <Clock className="w-3 h-3" />
              </div>
              <span className="font-medium">{formatTimeRange(appointment.startTime, appointment.endTime)}</span>
            </span>
            {appointment.location && (
              <span className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-5 h-5 rounded-lg glass-card flex items-center justify-center">
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="font-medium">{appointment.location}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-xl glass-card hover:scale-110 haptic-feedback"
            onClick={onEdit}
            disabled={deleteAppointmentMutation.isPending}
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-xl glass-card hover:scale-110 haptic-feedback"
            onClick={handleDelete}
            disabled={deleteAppointmentMutation.isPending}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div 
        className="absolute left-0 top-0 w-1 h-full rounded-r-lg transition-all duration-300 group-hover:w-2" 
        style={{ background: 'var(--secondary)' }}
      />
    </div>
  );
}
