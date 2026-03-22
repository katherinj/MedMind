import { Home as HomeIcon, Layers, FileQuestion, User } from "lucide-react";
import type { Screen } from "../types";
import React from "react";

interface BottomNavProps {
  active: Screen;
  onNavigate: (s: Screen) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center px-5 py-1.5 transition-all duration-200 active:scale-90 ${
      active
        ? "bg-primary/10 text-primary rounded-2xl"
        : "text-on-surface-variant/60 hover:text-on-surface-variant"
    }`}
  >
    {icon}
    <span className="font-label text-[10px] font-bold tracking-wider uppercase mt-1">
      {label}
    </span>
  </button>
);

export const BottomNav = ({ active, onNavigate }: BottomNavProps) => (
  <nav className="fixed bottom-0 left-0 w-full h-20 glass-effect flex justify-around items-center px-4 pb-safe z-50 border-t border-surface-container-low shadow-[0_-4px_20px_rgba(25,28,29,0.04)] rounded-t-2xl">
    <NavItem
      icon={<HomeIcon size={24} />}
      label="Home"
      active={active === "dashboard"}
      onClick={() => onNavigate("dashboard")}
    />
    <NavItem
      icon={<Layers size={24} />}
      label="Cards"
      active={active === "flashcards"}
      onClick={() => onNavigate("flashcards")}
    />
    <NavItem
      icon={<FileQuestion size={24} />}
      label="Quizzes"
      active={active === "quiz"}
      onClick={() => onNavigate("quiz")}
    />
    <NavItem
      icon={<User size={24} />}
      label="Profile"
      active={false}
      onClick={() => {}}
    />
  </nav>
);
