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
    <div className="appointment-card">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Users className="text-secondary w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground mb-1">{appointment.title}</h3>
          {appointment.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {appointment.description}
            </p>
          )}
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatTimeRange(appointment.startTime, appointment.endTime)}</span>
            </span>
            {appointment.location && (
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{appointment.location}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-muted haptic-feedback"
            onClick={onEdit}
            disabled={deleteAppointmentMutation.isPending}
          >
            <Edit className="w-3 h-3 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-destructive/10 haptic-feedback"
            onClick={handleDelete}
            disabled={deleteAppointmentMutation.isPending}
          >
            <Trash2 className="w-3 h-3 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="absolute left-0 top-0 w-1 h-full bg-secondary" />
    </div>
  );
}
