import { Moon, Sun, Settings as SettingsIcon, Bell, Palette, User, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mobile-container min-h-screen">
      {/* Header */}
      <header className="glass-card border-b border-border px-4 py-4 sticky top-0 z-40 backdrop-blur-xl" style={{ animation: 'scaleIn 0.4s ease-out' }}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center magnetic-effect relative overflow-hidden" 
               style={{ background: 'var(--primary)', boxShadow: '0 8px 25px var(--shadow-color)' }}>
            <SettingsIcon className="text-primary-foreground w-6 h-6 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text magnetic-effect">Configurações</h1>
            <p className="text-sm text-muted-foreground font-medium">Personalize sua experiência</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Aparência */}
        <div className="glass-card rounded-2xl p-6 elevated-card" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Palette className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-bold gradient-text">Aparência</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 glass-card rounded-xl magnetic-effect">
              <div className="flex items-center space-x-3">
                {theme === 'light' ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-accent" />
                )}
                <div>
                  <p className="font-semibold">Modo {theme === 'light' ? 'Claro' : 'Escuro'}</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' ? 'Interface clara e moderna' : 'Interface escura e elegante'}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="glass-card rounded-2xl p-6 elevated-card" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--secondary)' }}>
              <Bell className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h2 className="text-lg font-bold gradient-text">Notificações</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 glass-card rounded-xl magnetic-effect">
              <div>
                <p className="font-semibold">Lembretes de Tarefas</p>
                <p className="text-sm text-muted-foreground">Receba notificações sobre suas tarefas</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-secondary" />
            </div>
            
            <div className="flex items-center justify-between p-4 glass-card rounded-xl magnetic-effect">
              <div>
                <p className="font-semibold">Compromissos</p>
                <p className="text-sm text-muted-foreground">Alertas para seus compromissos agendados</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-secondary" />
            </div>
          </div>
        </div>

        {/* Conta */}
        <div className="glass-card rounded-2xl p-6 elevated-card" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-bold gradient-text">Conta</h2>
          </div>
          
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start magnetic-effect glass-card">
              <User className="w-4 h-4 mr-3" />
              Perfil do Usuário
            </Button>
            
            <Button variant="ghost" className="w-full justify-start magnetic-effect glass-card">
              <SettingsIcon className="w-4 h-4 mr-3" />
              Preferências Avançadas
            </Button>
          </div>
        </div>

        {/* Sobre */}
        <div className="glass-card rounded-2xl p-6 elevated-card" style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--muted)' }}>
              <Info className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold gradient-text">Sobre</h2>
          </div>
          
          <div className="text-center py-4">
            <h3 className="text-xl font-bold gradient-text mb-2">TaskFlow</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie suas tarefas e compromissos com elegância e simplicidade.
            </p>
            <p className="text-xs text-muted-foreground">
              Versão 1.0.0 • Desenvolvido com ❤️
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}