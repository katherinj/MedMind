import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { TopBar } from "./components/TopBar";
import { BottomNav } from "./components/BottomNav";
import { Dashboard } from "./pages/Dashboard";
import { Flashcards } from "./pages/Flashcards";
import { Quiz } from "./pages/Quiz";
import { Matching } from "./pages/Matching";
import { Login } from "./pages/Login";
import { useAuth } from "./hooks/useAuth";
import { Screen } from "./types";

export default function App() {
  const { user, loading, logout } = useAuth();
  const [screen, setScreen] = useState<Screen>("dashboard");

  const getTitle = () => {
    switch (screen) {
      case "dashboard":
        return "MedMind";
      case "flashcards":
        return "Flashcards";
      case "quiz":
        return "Quiz";
      case "matching":
        return "Drug Matching";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl pill-gradient animate-pulse" />
          <p className="text-on-surface-variant font-medium text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen">
      <TopBar
        title={getTitle()}
        onBack={
          screen !== "dashboard" ? () => setScreen("dashboard") : undefined
        }
        onLogout={logout}
      />

      <AnimatePresence mode="wait">
        {screen === "dashboard" && (
          <Dashboard key="dash" onNavigate={setScreen} user={user} />
        )}
        {screen === "flashcards" && (
          <Flashcards key="flash" onBack={() => setScreen("dashboard")} />
        )}
        {screen === "quiz" && (
          <Quiz key="quiz" onBack={() => setScreen("dashboard")} />
        )}
        {screen === "matching" && (
          <Matching key="match" onBack={() => setScreen("dashboard")} />
        )}
      </AnimatePresence>

      <BottomNav active={screen} onNavigate={setScreen} />

      <div className="fixed top-40 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-40 -right-20 w-80 h-80 bg-tertiary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
}
