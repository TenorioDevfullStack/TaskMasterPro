import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { getTodayDateString } from "@/lib/utils";
import { insertTaskSchema, insertAppointmentSchema, type InsertTask, type InsertAppointment } from "@shared/schema";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormType = 'task' | 'appointment';

export function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const [formType, setFormType] = useState<FormType>('task');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const taskForm = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Trabalho",
      date: getTodayDateString(),
      time: "09:00",
      completed: false,
      reminderEnabled: false,
    },
  });

  const appointmentForm = useForm<InsertAppointment>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: getTodayDateString(),
      startTime: "09:00",
      endTime: "10:00",
      reminderEnabled: false,
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      return await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Tarefa criada!",
        description: "Sua tarefa foi adicionada com sucesso",
      });
      taskForm.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa",
        variant: "destructive",
      });
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      return await apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Compromisso criado!",
        description: "Seu compromisso foi adicionado com sucesso",
      });
      appointmentForm.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o compromisso",
        variant: "destructive",
      });
    },
  });

  const onTaskSubmit = (data: InsertTask) => {
    createTaskMutation.mutate(data);
  };

  const onAppointmentSubmit = (data: InsertAppointment) => {
    createAppointmentMutation.mutate(data);
  };

  const handleClose = () => {
    taskForm.reset();
    appointmentForm.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${isOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold gradient-text">
              {formType === 'task' ? 'Nova Tarefa' : 'Novo Compromisso'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl glass-card hover:scale-110 transition-all duration-300"
              onClick={handleClose}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          {/* Form Type Toggle */}
          <div className="flex space-x-2 glass-card rounded-2xl p-2 mb-8">
            <button
              type="button"
              className={`tab-button ${formType === 'task' ? 'active' : 'inactive'}`}
              onClick={() => setFormType('task')}
            >
              Tarefa
            </button>
            <button
              type="button"
              className={`tab-button ${formType === 'appointment' ? 'active' : 'inactive'}`}
              onClick={() => setFormType('appointment')}
            >
              Compromisso
            </button>
          </div>

          {/* Task Form */}
          {formType === 'task' && (
            <form onSubmit={taskForm.handleSubmit(onTaskSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="task-title">Título</Label>
                <Input
                  id="task-title"
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
                <Label htmlFor="task-description">Descrição</Label>
                <Textarea
                  id="task-description"
                  placeholder="Adicione uma descrição..."
                  {...taskForm.register("description")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-date">Data</Label>
                  <Input
                    id="task-date"
                    type="date"
                    {...taskForm.register("date")}
                  />
                </div>
                <div>
                  <Label htmlFor="task-time">Horário</Label>
                  <Input
                    id="task-time"
                    type="time"
                    {...taskForm.register("time")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="task-category">Categoria</Label>
                <Select onValueChange={(value) => taskForm.setValue("category", value)}>
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
                  id="task-reminder"
                  onCheckedChange={(checked) => 
                    taskForm.setValue("reminderEnabled", checked as boolean)
                  }
                />
                <Label htmlFor="task-reminder">Definir lembrete</Label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createTaskMutation.isPending}
                >
                  {createTaskMutation.isPending ? "Criando..." : "Criar"}
                </Button>
              </div>
            </form>
          )}

          {/* Appointment Form */}
          {formType === 'appointment' && (
            <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="appointment-title">Título</Label>
                <Input
                  id="appointment-title"
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
                <Label htmlFor="appointment-description">Descrição</Label>
                <Textarea
                  id="appointment-description"
                  placeholder="Adicione uma descrição..."
                  {...appointmentForm.register("description")}
                />
              </div>

              <div>
                <Label htmlFor="appointment-location">Local</Label>
                <Input
                  id="appointment-location"
                  placeholder="Onde será o compromisso..."
                  {...appointmentForm.register("location")}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="appointment-date">Data</Label>
                  <Input
                    id="appointment-date"
                    type="date"
                    {...appointmentForm.register("date")}
                  />
                </div>
                <div>
                  <Label htmlFor="appointment-start">Início</Label>
                  <Input
                    id="appointment-start"
                    type="time"
                    {...appointmentForm.register("startTime")}
                  />
                </div>
                <div>
                  <Label htmlFor="appointment-end">Fim</Label>
                  <Input
                    id="appointment-end"
                    type="time"
                    {...appointmentForm.register("endTime")}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="appointment-reminder"
                  onCheckedChange={(checked) => 
                    appointmentForm.setValue("reminderEnabled", checked as boolean)
                  }
                />
                <Label htmlFor="appointment-reminder">Definir lembrete</Label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createAppointmentMutation.isPending}
                >
                  {createAppointmentMutation.isPending ? "Criando..." : "Criar"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
