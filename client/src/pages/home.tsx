import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, User, CheckCircle2, Calendar, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/task-card";
import { AppointmentCard } from "@/components/appointment-card";
import { CreateModal } from "@/components/create-modal";
import { EditModal } from "@/components/edit-modal";
import { getCurrentDateString, getTodayDateString } from "@/lib/utils";
import type { Task, Appointment } from "@shared/schema";

type TabType = "hoje" | "proximos" | "concluidos";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("hoje");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'task' | 'appointment'; id: number } | null>(null);

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const todayString = getTodayDateString();

  const filteredTasks = tasks.filter(task => {
    switch (activeTab) {
      case "hoje":
        return task.date === todayString;
      case "proximos":
        return task.date > todayString && !task.completed;
      case "concluidos":
        return task.completed;
      default:
        return true;
    }
  });

  const todayAppointments = appointments.filter(appointment => 
    appointment.date === todayString
  );

  const todayTasks = tasks.filter(task => 
    task.date === todayString && !task.completed
  );

  const handleEdit = (type: 'task' | 'appointment', id: number) => {
    setEditingItem({ type, id });
    setIsEditModalOpen(true);
  };

  if (tasksLoading || appointmentsLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      {/* Header */}
      <header className="bg-surface border-b border-border px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-primary-foreground w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">TaskFlow</h1>
              <p className="text-xs text-muted-foreground">{getCurrentDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Search className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-surface px-4 py-3 border-b border-border">
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {(['hoje', 'proximos', 'concluidos'] as TabType[]).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'hoje' ? 'Hoje' : tab === 'proximos' ? 'Próximos' : 'Concluídos'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-4 pb-24 space-y-4">
        {/* Quick Stats */}
        {activeTab === 'hoje' && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{todayTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Tarefas hoje</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{todayAppointments.length}</p>
                  <p className="text-sm text-muted-foreground">Compromissos</p>
                </div>
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="text-secondary w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">
            {activeTab === 'hoje' ? 'Tarefas de Hoje' : 
             activeTab === 'proximos' ? 'Próximas Tarefas' : 
             'Tarefas Concluídas'}
          </h2>
          <Button variant="ghost" size="sm" className="text-primary text-sm font-medium">
            Ver todas
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={() => handleEdit('task', task.id)}
              />
            ))
          )}
        </div>

        {/* Appointments Section */}
        {activeTab === 'hoje' && (
          <>
            <div className="flex items-center justify-between mb-3 mt-8">
              <h2 className="text-lg font-semibold text-foreground">Compromissos</h2>
              <Button variant="ghost" size="sm" className="text-primary text-sm font-medium">
                Ver todos
              </Button>
            </div>

            <div className="space-y-3">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum compromisso para hoje</p>
                </div>
              ) : (
                todayAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment}
                    onEdit={() => handleEdit('appointment', appointment.id)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          className="floating-action-button haptic-feedback"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="text-primary-foreground w-6 h-6" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface border-t border-border px-4 py-2 z-20">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center space-y-1 p-2 text-primary">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-medium">Início</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Calendário</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-muted-foreground hover:text-foreground transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Insights</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Config</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <CreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      {editingItem && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          type={editingItem.type}
          id={editingItem.id}
        />
      )}
    </div>
  );
}
