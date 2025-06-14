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
        return 'var(--accent)';
      case 'pessoal':
        return 'var(--primary)';
      case 'saúde':
        return 'var(--secondary)';
      case 'estudo':
        return 'var(--destructive)';
      default:
        return 'var(--muted)';
    }
  };

  return (
    <div className="task-card group">
      <div className="flex items-start space-x-4">
        <button
          className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center mt-1 flex-shrink-0 transition-all duration-300 haptic-feedback hover:scale-110 ${
            task.completed
              ? 'border-transparent shadow-lg'
              : 'border-muted-foreground hover:border-transparent hover:shadow-md'
          }`}
          style={{
            background: task.completed ? 'var(--secondary)' : 'transparent',
            boxShadow: task.completed ? '0 4px 15px var(--shadow-color)' : undefined
          }}
          onClick={handleToggleComplete}
          disabled={toggleCompleteMutation.isPending}
        >
          {task.completed && (
            <svg className="w-4 h-4 text-white animate-in zoom-in duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold mb-2 text-lg transition-all duration-300 ${
            task.completed 
              ? 'line-through text-muted-foreground' 
              : 'text-foreground group-hover:text-primary'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mb-3 leading-relaxed ${
              task.completed ? 'text-muted-foreground' : 'text-muted-foreground'
            }`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center space-x-6 text-sm">
            <span className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-5 h-5 rounded-lg glass-card flex items-center justify-center">
                <Clock className="w-3 h-3" />
              </div>
              <span className="font-medium">{formatTime(task.time)}</span>
            </span>
            <span className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-5 h-5 rounded-lg glass-card flex items-center justify-center">
                <Tag className="w-3 h-3" />
              </div>
              <span className="font-medium">{task.category}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-xl glass-card hover:scale-110 haptic-feedback"
            onClick={onEdit}
            disabled={deleteTaskMutation.isPending}
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-xl glass-card hover:scale-110 haptic-feedback"
            onClick={handleDelete}
            disabled={deleteTaskMutation.isPending}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div 
        className="absolute left-0 top-0 w-1 h-full rounded-r-lg transition-all duration-300 group-hover:w-2" 
        style={{ background: getCategoryColor(task.category) }}
      />
    </div>
  );
}
