import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/lib/utils";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleCompleteMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      return await apiRequest("PATCH", `/api/tasks/${task.id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: task.completed ? "Tarefa marcada como pendente" : "Tarefa concluída!",
        description: task.title,
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi removida com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      });
    },
  });

  const handleToggleComplete = () => {
    toggleCompleteMutation.mutate(!task.completed);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      deleteTaskMutation.mutate();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'trabalho':
        return 'bg-accent';
      case 'pessoal':
        return 'bg-primary';
      case 'saúde':
        return 'bg-secondary';
      case 'estudo':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="task-card">
      <div className="flex items-start space-x-3">
        <button
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors haptic-feedback ${
            task.completed
              ? 'border-secondary bg-secondary'
              : 'border-muted-foreground hover:border-secondary'
          }`}
          onClick={handleToggleComplete}
          disabled={toggleCompleteMutation.isPending}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium mb-1 ${
            task.completed 
              ? 'line-through text-muted-foreground' 
              : 'text-foreground'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mb-2 ${
              task.completed ? 'text-muted-foreground' : 'text-muted-foreground'
            }`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatTime(task.time)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>{task.category}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-muted haptic-feedback"
            onClick={onEdit}
            disabled={deleteTaskMutation.isPending}
          >
            <Edit className="w-3 h-3 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-destructive/10 haptic-feedback"
            onClick={handleDelete}
            disabled={deleteTaskMutation.isPending}
          >
            <Trash2 className="w-3 h-3 text-destructive" />
          </Button>
        </div>
      </div>
      <div className={`absolute left-0 top-0 w-1 h-full ${getCategoryColor(task.category)}`} />
    </div>
  );
}
