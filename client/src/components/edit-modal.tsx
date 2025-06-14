import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertTaskSchema, insertAppointmentSchema, type InsertTask, type InsertAppointment, type Task, type Appointment } from "@shared/schema";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'task' | 'appointment';
  id: number;
}

export function EditModal({ isOpen, onClose, type, id }: EditModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: task, isLoading: taskLoading } = useQuery<Task>({
    queryKey: ["/api/tasks", id],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error('Failed to fetch task');
      return response.json();
    },
    enabled: isOpen && type === 'task',
  });

  const { data: appointment, isLoading: appointmentLoading } = useQuery<Appointment>({
    queryKey: ["/api/appointments", id],
    queryFn: async () => {
      const response = await fetch(`/api/appointments/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error('Failed to fetch appointment');
      return response.json();
    },
    enabled: isOpen && type === 'appointment',
  });

  const taskForm = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
  });

  const appointmentForm = useForm<InsertAppointment>({
    resolver: zodResolver(insertAppointmentSchema),
  });

  // Reset forms when data loads
  useEffect(() => {
    if (task && type === 'task') {
      taskForm.reset({
        title: task.title,
        description: task.description || "",
        category: task.category,
        date: task.date,
        time: task.time,
        completed: task.completed,
        reminderEnabled: task.reminderEnabled,
      });
    }
  }, [task, taskForm, type]);

  useEffect(() => {
    if (appointment && type === 'appointment') {
      appointmentForm.reset({
        title: appointment.title,
        description: appointment.description || "",
        location: appointment.location || "",
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        reminderEnabled: appointment.reminderEnabled,
      });
    }
  }, [appointment, appointmentForm, type]);

  const updateTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      return await apiRequest("PATCH", `/api/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", id] });
      toast({
        title: "Tarefa atualizada!",
        description: "Suas alterações foram salvas com sucesso",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      return await apiRequest("PATCH", `/api/appointments/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments", id] });
      toast({
        title: "Compromisso atualizado!",
        description: "Suas alterações foram salvas com sucesso",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o compromisso",
        variant: "destructive",
      });
    },
  });

  const onTaskSubmit = (data: InsertTask) => {
    updateTaskMutation.mutate(data);
  };

  const onAppointmentSubmit = (data: InsertAppointment) => {
    updateAppointmentMutation.mutate(data);
  };

  if (!isOpen) return null;
  if ((type === 'task' && taskLoading) || (type === 'appointment' && appointmentLoading)) {
    return (
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
        <div className={`modal-content ${isOpen ? 'open' : ''}`}>
          <div className="p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div 
        className={`modal-content ${isOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {type === 'task' ? 'Editar Tarefa' : 'Editar Compromisso'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg hover:bg-muted"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Task Form */}
          {type === 'task' && task && (
            <form onSubmit={taskForm.handleSubmit(onTaskSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="edit-task-title">Título</Label>
                <Input
                  id="edit-task-title"
                  placeholder="Digite o título..."
                  {...taskForm.register("title")}
                />
                {taskForm.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {taskForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-task-description">Descrição</Label>
                <Textarea
                  id="edit-task-description"
                  placeholder="Adicione uma descrição..."
                  {...taskForm.register("description")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-task-date">Data</Label>
                  <Input
                    id="edit-task-date"
                    type="date"
                    {...taskForm.register("date")}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-task-time">Horário</Label>
                  <Input
                    id="edit-task-time"
                    type="time"
                    {...taskForm.register("time")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-task-category">Categoria</Label>
                <Select onValueChange={(value) => taskForm.setValue("category", value)} defaultValue={task.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trabalho">Trabalho</SelectItem>
                    <SelectItem value="Pessoal">Pessoal</SelectItem>
                    <SelectItem value="Saúde">Saúde</SelectItem>
                    <SelectItem value="Estudo">Estudo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-task-reminder"
                  defaultChecked={task.reminderEnabled}
                  onCheckedChange={(checked) => 
                    taskForm.setValue("reminderEnabled", checked as boolean)
                  }
                />
                <Label htmlFor="edit-task-reminder">Definir lembrete</Label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateTaskMutation.isPending}
                >
                  {updateTaskMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}

          {/* Appointment Form */}
          {type === 'appointment' && appointment && (
            <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="edit-appointment-title">Título</Label>
                <Input
                  id="edit-appointment-title"
                  placeholder="Digite o título..."
                  {...appointmentForm.register("title")}
                />
                {appointmentForm.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {appointmentForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-appointment-description">Descrição</Label>
                <Textarea
                  id="edit-appointment-description"
                  placeholder="Adicione uma descrição..."
                  {...appointmentForm.register("description")}
                />
              </div>

              <div>
                <Label htmlFor="edit-appointment-location">Local</Label>
                <Input
                  id="edit-appointment-location"
                  placeholder="Onde será o compromisso..."
                  {...appointmentForm.register("location")}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-appointment-date">Data</Label>
                  <Input
                    id="edit-appointment-date"
                    type="date"
                    {...appointmentForm.register("date")}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-appointment-start">Início</Label>
                  <Input
                    id="edit-appointment-start"
                    type="time"
                    {...appointmentForm.register("startTime")}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-appointment-end">Fim</Label>
                  <Input
                    id="edit-appointment-end"
                    type="time"
                    {...appointmentForm.register("endTime")}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-appointment-reminder"
                  defaultChecked={appointment.reminderEnabled}
                  onCheckedChange={(checked) => 
                    appointmentForm.setValue("reminderEnabled", checked as boolean)
                  }
                />
                <Label htmlFor="edit-appointment-reminder">Definir lembrete</Label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateAppointmentMutation.isPending}
                >
                  {updateAppointmentMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
