import { useState } from 'react';
import { Timer, Pill, Flag, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Drug } from '../types';
import drugsData from '../data/drugs.json';

const drugs: Drug[] = drugsData as Drug[];

interface Question {
  question: string;
  options: { id: string; label: string }[];
  correctId: string;
  domain: string;
  subdomain: string;
}

function generateQuestions(drugList: Drug[]): Question[] {
  const questions: Question[] = [];

  drugList.forEach((drug) => {
    // Brand → Generic
    const wrongGenerics = drugList
      .filter((d) => d.id !== drug.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((d) => d.generic);

    questions.push({
      question: `What is the generic name for ${drug.brand[0]}?`,
      options: shuffle([
        { id: 'correct', label: drug.generic },
        ...wrongGenerics.map((g, i) => ({ id: `wrong${i}`, label: g })),
      ]),
      correctId: 'correct',
      domain: 'Medications',
      subdomain: 'Generic & Brand Names',
    });

    // Class identification
    const wrongClasses = drugList
      .filter((d) => d.id !== drug.id && d.class !== drug.class)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((d) => d.class);

    if (wrongClasses.length >= 3) {
      questions.push({
        question: `What drug class does ${drug.generic} belong to?`,
        options: shuffle([
          { id: 'correct', label: drug.class },
          ...wrongClasses.map((c, i) => ({ id: `wrong${i}`, label: c })),
        ]),
        correctId: 'correct',
        domain: 'Medications',
        subdomain: 'Classifications',
      });
    }
  });

  return shuffle(questions);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const LETTERS = ['A', 'B', 'C', 'D'];

export const Quiz = ({ onBack }: { onBack: () => void }) => {
  const [questions] = useState(() => generateQuestions(drugs).slice(0, 20));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const progress = Math.round(((currentIndex) / questions.length) * 100);

  const handleSelect = (id: string) => {
    if (revealed) return;
    setSelected(id);
  };

  const handleSubmit = () => {
    if (!selected) return;
    if (!revealed) {
      setRevealed(true);
      if (selected === question.correctId) setScore((s) => s + 1);
      return;
    }
    // Next question
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pt-24 pb-32 px-6 max-w-3xl mx-auto w-full flex flex-col items-center text-center gap-8"
      >
        <div className="bg-surface-container-lowest rounded-3xl p-12 w-full shadow-sm">
          <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">Quiz Complete</p>
          <p className="font-headline text-7xl font-extrabold text-primary mb-2">{pct}%</p>
          <p className="text-on-surface-variant text-lg font-medium mb-8">
            {score} of {questions.length} correct
          </p>
          {pct >= 75 ? (
            <p className="text-on-surface font-bold text-xl">Great work! Keep it up.</p>
          ) : (
            <p className="text-on-surface font-bold text-xl">Keep studying — you'll get there!</p>
          )}
        </div>
        <button
          onClick={onBack}
          className="pill-gradient text-white px-12 py-5 rounded-full font-headline font-bold text-lg shadow-lg"
        >
          Back to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="pt-24 pb-32 px-6 max-w-3xl mx-auto w-full"
    >
      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="font-headline text-4xl font-extrabold text-primary tracking-tight">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-on-surface-variant font-bold ml-1 uppercase text-sm">
              / {questions.length} Questions
            </span>
          </div>
          <div className="flex items-center text-tertiary font-bold text-sm bg-tertiary-fixed px-4 py-2 rounded-full">
            <Timer size={16} className="mr-2" />
            <span>{score} correct</span>
          </div>
        </div>
        <div className="h-3 w-full bg-secondary-container rounded-full overflow-hidden">
          <div
            className="h-full pill-gradient rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="mb-10">
        <div className="bg-surface-container-lowest p-10 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-full -mr-20 -mt-20" />
          <h2 className="font-headline text-2xl font-bold text-on-surface leading-tight relative z-10">
            {question.question}
          </h2>
          <p className="mt-6 text-on-surface-variant text-xs font-bold tracking-widest flex items-center uppercase">
            <Pill size={16} className="mr-2 text-primary" />
            {question.domain} · {question.subdomain}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-4 mb-12">
        {question.options.map((opt, i) => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.id === question.correctId;
          let stateClass = 'bg-surface-container-lowest border-transparent hover:bg-surface-container-high';
          if (revealed) {
            if (isCorrect) stateClass = 'bg-surface-container-highest border-primary/60';
            else if (isSelected && !isCorrect) stateClass = 'bg-error-container border-error/40';
            else stateClass = 'bg-surface-container-lowest border-transparent opacity-50';
          } else if (isSelected) {
            stateClass = 'bg-surface-container-highest border-primary/40';
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`group flex items-center p-6 rounded-2xl transition-all duration-200 active:scale-[0.98] border-2 ${stateClass}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-5 shrink-0 transition-colors text-sm ${
                  revealed && isCorrect
                    ? 'bg-primary text-white'
                    : revealed && isSelected && !isCorrect
                      ? 'bg-error text-white'
                      : isSelected
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                {LETTERS[i]}
              </div>
              <span className="text-lg font-bold text-on-surface capitalize">{opt.label}</span>
              {revealed && isCorrect && <CheckCircle2 className="ml-auto text-primary" size={22} />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <button className="text-on-surface-variant font-bold hover:text-primary transition-colors flex items-center uppercase text-xs tracking-widest">
          <Flag size={18} className="mr-2" />
          Report Issue
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full md:w-auto pill-gradient text-white px-12 py-5 rounded-full font-headline font-bold text-xl shadow-lg active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {revealed ? (currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question') : 'Submit Answer'}
        </button>
      </div>
    </motion.div>
  );
};
