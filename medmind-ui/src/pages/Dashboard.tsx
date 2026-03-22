import {
  ArrowLeft,
  Flame,
  ChevronRight,
  TrendingDown,
  AlertTriangle,
  Check,
  Timer,
  Layers,
  FileQuestion,
  Puzzle,
} from "lucide-react";
import { motion } from "motion/react";
import type { User } from "firebase/auth";
import type { Screen } from "../types";

interface DashboardProps {
  onNavigate: (s: Screen) => void;
  user: User;
}

const ModuleCard = ({
  title,
  desc,
  icon,
  bgColor,
  btnText,
  btnIcon,
  onClick,
  variant,
}: any) => (
  <div
    className={`p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[260px] ${
      variant === "primary"
        ? "bg-surface-container-lowest"
        : variant === "secondary"
          ? "bg-surface-container-low"
          : "bg-surface-container-highest"
    }`}
  >
    <div className="space-y-4">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor}`}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-xl font-bold tracking-tight">{title}</h4>
        <p className="text-on-surface-variant text-sm mt-1">{desc}</p>
      </div>
    </div>
    <button
      onClick={onClick}
      className={`mt-8 w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${
        variant === "primary"
          ? "pill-gradient text-white shadow-lg shadow-primary/20"
          : variant === "secondary"
            ? "bg-surface-container-highest text-on-surface"
            : "bg-on-surface text-surface"
      }`}
    >
      {btnText} {btnIcon}
    </button>
  </div>
);

const FocusItem = ({ title, desc, mastery, status, img }: any) => (
  <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-6 group hover:bg-surface-container transition-all cursor-pointer">
    <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden relative">
      <img
        src={img}
        alt=""
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
    </div>
    <div className="flex-grow">
      <div
        className={`flex items-center gap-2 font-bold text-[10px] uppercase mb-1 ${status === "down" ? "text-error" : "text-tertiary"}`}
      >
        {status === "down" ? (
          <TrendingDown size={14} />
        ) : (
          <AlertTriangle size={14} />
        )}
        {mastery}
      </div>
      <h5 className="font-bold text-lg leading-tight">{title}</h5>
      <p className="text-on-surface-variant text-sm mt-1">{desc}</p>
    </div>
    <ChevronRight className="text-outline" size={20} />
  </div>
);

const GoalItem = ({ label, checked }: { label: string; checked?: boolean }) => (
  <label className="flex items-center gap-4 cursor-pointer group">
    <div
      className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${checked ? "bg-primary border-primary" : "border-outline-variant"}`}
    >
      {checked && <Check size={14} className="text-white font-bold" />}
    </div>
    <span
      className={`font-medium transition-all ${checked ? "text-on-surface-variant/50 line-through" : "text-on-surface"}`}
    >
      {label}
    </span>
  </label>
);

export const Dashboard = ({ onNavigate, user }: DashboardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="pt-24 px-6 max-w-7xl mx-auto space-y-10 pb-32"
  >
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
      <div className="lg:col-span-8 space-y-6">
        <p className="text-primary font-bold tracking-wider uppercase text-xs">
          Welcome back, {user.displayName?.split(" ")[0] ?? "Student"}
        </p>
        <h2 className="text-[2.75rem] font-extrabold leading-none tracking-tight text-on-surface">
          Mastery is within <span className="text-primary">82%</span> reach
          today.
        </h2>
        <div className="h-4 w-full bg-secondary-container rounded-full overflow-hidden">
          <div
            className="h-full pill-gradient rounded-full"
            style={{ width: "82%" }}
          ></div>
        </div>
      </div>
      <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full min-h-[160px]">
        <div className="flex justify-between items-start">
          <Flame className="text-tertiary fill-tertiary" size={40} />
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              Streaks
            </p>
            <p className="text-3xl font-extrabold text-on-surface">14 Days</p>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          You're in the top 5% of active students this week.
        </p>
      </div>
    </section>

    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-2xl font-bold tracking-tight">Active Modules</h3>
        <button className="text-primary font-bold text-sm hover:underline">
          View All Library
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModuleCard
          title="Top 200 Drugs"
          desc="Spaced repetition flashcards"
          icon={<Layers className="text-primary" size={32} />}
          bgColor="bg-primary/5"
          btnText="Resume Cards"
          btnIcon={<ArrowLeft className="rotate-180" size={16} />}
          onClick={() => onNavigate("flashcards")}
          variant="primary"
        />
        <ModuleCard
          title="Law & Regulations"
          desc="Timed regulatory mock quiz"
          icon={<FileQuestion className="text-secondary" size={32} />}
          bgColor="bg-secondary-container/30"
          btnText="Take Quiz"
          btnIcon={<Timer size={16} />}
          onClick={() => onNavigate("quiz")}
          variant="secondary"
        />
        <ModuleCard
          title="Drug Matching"
          desc="Quick-fire classification game"
          icon={<Puzzle className="text-tertiary" size={32} />}
          bgColor="bg-tertiary-fixed"
          btnText="Play Now"
          btnIcon={<Puzzle size={16} />}
          onClick={() => onNavigate("matching")}
          variant="tertiary"
        />
      </div>
    </section>

    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 space-y-6">
        <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
          Focus Needed
          <span className="px-2 py-0.5 bg-error-container text-error text-[10px] rounded-full uppercase font-black">
            Weak Areas
          </span>
        </h3>
        <div className="space-y-4">
          <FocusItem
            title="Pharmacokinetics & Metabolism"
            desc="Recommended: 15min deep dive on CYP450 enzymes."
            mastery="42% Mastery"
            status="down"
            img="https://picsum.photos/seed/med1/200/200"
          />
          <FocusItem
            title="Antineoplastic Agents"
            desc="3 new modules added to your upcoming curriculum."
            mastery="New Content"
            status="new"
            img="https://picsum.photos/seed/med2/200/200"
          />
        </div>
      </div>
      <div className="lg:col-span-5 bg-surface-container rounded-2xl p-8 space-y-8">
        <h3 className="text-xl font-bold tracking-tight">Today's Goals</h3>
        <div className="space-y-5">
          <GoalItem label="Review 50 Flashcards" checked />
          <GoalItem label="Complete 1 Law Quiz" />
          <GoalItem label="20 mins of matching practice" />
          <GoalItem label="Update Weekly Log" />
        </div>
        <div className="pt-6 border-t border-outline-variant/20">
          <div className="flex justify-between text-sm font-bold mb-3">
            <span>Total Focus Time</span>
            <span className="text-primary">45 / 60 min</span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);
