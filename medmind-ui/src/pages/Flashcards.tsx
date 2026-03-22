import React, { useState } from "react";
import { Timer, RotateCw, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Drug } from "../types";
import drugsData from "../data/drugs.json";

const drugs: Drug[] = drugsData as Drug[];

type FocusField =
  | "brand"
  | "class"
  | "indication"
  | "mechanism"
  | "sideEffects"
  | "interactions";

const FOCUS_OPTIONS: { value: FocusField; label: string }[] = [
  { value: "brand", label: "Brand Names" },
  { value: "class", label: "Drug Class" },
  { value: "indication", label: "Indications" },
  { value: "mechanism", label: "Mechanism" },
  { value: "sideEffects", label: "Side Effects" },
  { value: "interactions", label: "Interactions" },
];

function renderFieldValue(drug: Drug, field: FocusField): React.ReactNode {
  switch (field) {
    case "brand":
      return drug.brand.join(", ");
    case "class":
      return drug.class;
    case "indication":
      return drug.indication;
    case "mechanism":
      return drug.mechanism;
    case "sideEffects":
      return (
        <ul className="space-y-2">
          {drug.sideEffects.map((se) => (
            <li key={se} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="capitalize">{se}</span>
            </li>
          ))}
        </ul>
      );
    case "interactions":
      return (
        <div className="space-y-3 text-sm">
          {drug.interactions.drugs.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">
                Drug–Drug
              </span>
              <span>{drug.interactions.drugs.join(", ")}</span>
            </div>
          )}
          {drug.interactions.food.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">
                Food
              </span>
              <span>{drug.interactions.food.join(", ")}</span>
            </div>
          )}
          {drug.interactions.conditions.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">
                Conditions
              </span>
              <span>{drug.interactions.conditions.join(", ")}</span>
            </div>
          )}
        </div>
      );
  }
}

export const Flashcards = ({ onBack }: { onBack: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [focus, setFocus] = useState<FocusField>("brand");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  const drug = drugs[currentIndex];
  const total = drugs.length;
  const progress = Math.round(((correct + incorrect) / total) * 100);

  const handleNext = (knew: boolean) => {
    if (knew) setCorrect((c) => c + 1);
    else setIncorrect((i) => i + 1);
    setFlipped(false);
    setTimeout(() => setCurrentIndex((i) => (i + 1) % total), 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="pt-24 pb-32 px-6 max-w-4xl mx-auto w-full"
    >
      {/* Progress header */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-primary font-headline font-bold text-3xl tracking-tight">
              {currentIndex + 1}
            </span>
            <span className="text-on-surface-variant font-label text-sm ml-1 uppercase">
              / {total} Drugs
            </span>
          </div>
          <div className="text-right">
            <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-1">
              Session Score
            </p>
            <p className="text-primary font-headline font-extrabold text-xl">
              {correct}/{correct + incorrect}
            </p>
          </div>
        </div>
        <div className="h-4 w-full bg-secondary-container rounded-full overflow-hidden">
          <div
            className="h-full pill-gradient rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Focus picker */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FOCUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setFocus(opt.value);
              setFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              focus === opt.value
                ? "pill-gradient text-white shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-3 space-y-4 hidden md:block">
          <div className="bg-surface-container rounded-2xl p-6">
            <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-3">
              Studying
            </p>
            <h3 className="font-headline font-bold text-on-surface leading-tight capitalize">
              {FOCUS_OPTIONS.find((o) => o.value === focus)?.label}
            </h3>
            <div className="mt-6 flex items-center gap-2">
              <Timer className="text-primary" size={16} />
              <span className="text-xs font-bold text-secondary">
                {correct + incorrect} reviewed
              </span>
            </div>
          </div>
          {currentIndex + 1 < total && (
            <div className="bg-surface-container-low rounded-2xl p-6">
              <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-2">
                Next Up
              </p>
              <p className="text-sm font-bold text-on-surface capitalize">
                {drugs[currentIndex + 1].generic}
              </p>
            </div>
          )}
          {drug.controlled && (
            <div className="bg-error-container rounded-2xl p-4">
              <p className="text-error text-[10px] uppercase font-bold tracking-widest mb-1">
                Controlled
              </p>
              <p className="text-error font-bold text-sm">
                Schedule {drug.schedule}
              </p>
            </div>
          )}
        </aside>

        {/* Card */}
        <div className="md:col-span-9 space-y-8">
          <div
            onClick={() => setFlipped(!flipped)}
            className="relative w-full min-h-[420px] cursor-pointer"
          >
            <AnimatePresence mode="wait">
              {!flipped ? (
                <motion.div
                  key="front"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full min-h-[420px] bg-surface-container-lowest rounded-[2.5rem] shadow-xl shadow-primary/5 flex flex-col items-center justify-center p-12 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[5rem]" />
                  <div className="text-center z-10 space-y-6">
                    <span className="text-primary/40 font-bold text-xs uppercase tracking-[0.3em]">
                      Generic Name
                    </span>
                    <h2 className="text-on-surface font-headline font-extrabold text-5xl tracking-tighter capitalize">
                      {drug.generic}
                    </h2>
                    {drug.controlled && (
                      <span className="inline-block px-3 py-1 bg-error-container text-error text-xs font-bold rounded-full uppercase tracking-wider">
                        Schedule {drug.schedule}
                      </span>
                    )}
                    <button className="mx-auto flex items-center gap-3 pill-gradient text-white px-10 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-all">
                      <RotateCw size={18} />
                      <span>Flip to Reveal</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full min-h-[420px] bg-surface-container-lowest rounded-[2.5rem] shadow-xl shadow-primary/5 p-10 flex flex-col justify-center"
                >
                  <div className="mb-4">
                    <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                      {FOCUS_OPTIONS.find((o) => o.value === focus)?.label}
                    </span>
                    <p className="text-xs text-on-surface-variant/60 mt-0.5 capitalize">
                      {drug.generic}
                    </p>
                  </div>
                  <div className="text-on-surface font-bold text-lg leading-relaxed">
                    {renderFieldValue(drug, focus)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNext(false)}
              className="flex-1 max-w-xs flex items-center justify-center gap-3 bg-surface-container-highest text-on-surface px-8 py-5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all"
            >
              <X className="text-error" size={24} />
              <span>Need Review</span>
            </button>
            <button
              onClick={() => handleNext(true)}
              className="flex-1 max-w-xs flex items-center justify-center gap-3 pill-gradient text-white px-8 py-5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <CheckCircle2 size={24} />
              <span>I Know This</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
