import { ArrowLeft, MoreVertical, LogOut } from "lucide-react";

interface TopBarProps {
  title: string;
  onBack?: () => void;
  onLogout?: () => void;
}

export const TopBar = ({ title, onBack, onLogout }: TopBarProps) => (
  <header className="fixed top-0 w-full z-50 glass-effect border-b border-surface-container-low">
    <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-surface-container-low transition-colors active:scale-95 rounded-full text-primary"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="font-headline font-bold tracking-tight text-on-surface text-lg">
          {title}
        </h1>
      </div>
      {onLogout ? (
        <button
          onClick={onLogout}
          className="p-2 hover:bg-surface-container-low transition-colors active:scale-95 rounded-full text-on-surface-variant hover:text-error"
          title="Log out"
        >
          <LogOut size={20} />
        </button>
      ) : (
        <button className="p-2 hover:bg-surface-container-low transition-colors active:scale-95 rounded-full text-primary">
          <MoreVertical size={24} />
        </button>
      )}
    </div>
  </header>
);
