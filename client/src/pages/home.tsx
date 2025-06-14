import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, User, CheckCircle2, Calendar, BarChart3, Settings, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/task-card";
import { AppointmentCard } from "@/components/appointment-card";
import { CreateModal } from "@/components/create-modal";
import { EditModal } from "@/components/edit-modal";
import { getCurrentDateString, getTodayDateString } from "@/lib/utils";
import { Link } from "wouter";
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
      {/* Parallax Background */}
      <div className="parallax-bg"></div>
      
      {/* Header */}
      <header className="glass-card border-b border-border px-4 py-4 sticky top-0 z-40 backdrop-blur-xl" style={{ animation: 'scaleIn 0.4s ease-out' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center magnetic-effect relative overflow-hidden" 
                 style={{ background: 'var(--primary)', boxShadow: '0 8px 25px var(--shadow-color)' }}>
              <CheckCircle2 className="text-primary-foreground w-6 h-6 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text magnetic-effect">TaskFlow</h1>
              <p className="text-sm text-muted-foreground font-medium">{getCurrentDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="rounded-xl w-10 h-10 glass-card magnetic-effect transition-all duration-300">
              <Search className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center magnetic-effect transition-all duration-300">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="glass-card px-4 py-4 border-b border-border">
        <div className="flex space-x-2 glass-card rounded-2xl p-2">
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
          <div className="grid grid-cols-2 gap-4 mb-8" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <div className="stat-card elevated-card group cursor-pointer magnetic-effect">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold gradient-text">{todayTasks.length}</p>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Tarefas hoje</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min((todayTasks.length / 10) * 100, 100)}%` }}></div>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative overflow-hidden"
                     style={{ background: 'var(--primary)' }}>
                  <CheckCircle2 className="text-primary-foreground w-7 h-7 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                </div>
              </div>
            </div>
            <div className="stat-card elevated-card group cursor-pointer magnetic-effect" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold gradient-text">{todayAppointments.length}</p>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Compromissos</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min((todayAppointments.length / 5) * 100, 100)}%`, background: 'var(--secondary)' }}></div>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative overflow-hidden"
                     style={{ background: 'var(--secondary)' }}>
                  <Calendar className="text-secondary-foreground w-7 h-7 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        <div className="flex items-center justify-between mb-6" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
          <h2 className="text-xl font-bold gradient-text magnetic-effect">
            {activeTab === 'hoje' ? 'Tarefas de Hoje' : 
             activeTab === 'proximos' ? 'Próximas Tarefas' : 
             'Tarefas Concluídas'}
          </h2>
          <Button variant="ghost" size="sm" className="text-primary text-sm font-semibold magnetic-effect glass-card px-4 py-2 rounded-xl">
            Ver todas
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl" style={{ animation: 'scaleIn 0.5s ease-out 0.3s both' }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--muted)' }}>
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">Nenhuma tarefa encontrada</p>
              <p className="text-sm text-muted-foreground mt-1">Crie sua primeira tarefa!</p>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div key={task.id} style={{ animation: `fadeInUp 0.6s ease-out ${0.1 * index}s both` }}>
                <TaskCard 
                  task={task} 
                  onEdit={() => handleEdit('task', task.id)}
                />
              </div>
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
      <div className="fixed bottom-24 right-6 z-30">
        <button
          className="floating-action-button haptic-feedback"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="text-primary-foreground w-7 h-7 relative z-10" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-card border-t border-border px-4 py-3 z-20 backdrop-blur-xl">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300 hover:scale-110" 
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-semibold">Início</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-3 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 rounded-xl glass-card">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Calendário</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-3 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 rounded-xl glass-card">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Insights</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-3 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 rounded-xl glass-card">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Config</span>
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
