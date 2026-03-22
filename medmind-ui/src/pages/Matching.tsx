import { useState, useEffect } from 'react';
import { BadgeCheck, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Drug } from '../types';
import drugsData from '../data/drugs.json';

const drugs: Drug[] = drugsData as Drug[];

interface MatchPair {
  generic: string;
  brand: string;
}

function getRandomPairs(count = 5): MatchPair[] {
  const shuffled = [...drugs].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((d) => ({ generic: d.generic, brand: d.brand[0] }));
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const Matching = ({ onBack }: { onBack: () => void }) => {
  const [pairs, setPairs] = useState<MatchPair[]>(() => getRandomPairs(5));
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setLeftItems(shuffle(pairs.map((p) => p.brand)));
    setRightItems(shuffle(pairs.map((p) => p.generic)));
    setMatched(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setScore(0);
    setFinished(false);
  }, [pairs]);

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;

    const pair = pairs.find((p) => p.brand === selectedLeft && p.generic === selectedRight);
    if (pair) {
      const newMatched = new Set(matched);
      newMatched.add(selectedLeft);
      newMatched.add(selectedRight);
      setMatched(newMatched);
      setScore((s) => s + 1);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (newMatched.size === pairs.length * 2) {
        setTimeout(() => setFinished(true), 600);
      }
    } else {
      setWrong(`${selectedLeft}-${selectedRight}`);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrong(null);
      }, 800);
    }
  }, [selectedLeft, selectedRight]);

  const progress = (score / pairs.length) * 100;

  const handleNewRound = () => {
    setPairs(getRandomPairs(5));
  };

  const getItemClass = (item: string, side: 'left' | 'right') => {
    const isSelected = side === 'left' ? selectedLeft === item : selectedRight === item;
    const isMatched = matched.has(item);
    const isWrong = wrong?.includes(item);

    if (isMatched) return 'bg-surface-container border-primary/30 opacity-40 cursor-default';
    if (isWrong) return 'bg-error-container border-error/40 scale-[0.98]';
    if (isSelected) return 'bg-surface-container-highest border-primary/50 scale-[1.02]';
    return 'bg-surface-container-lowest border-transparent hover:border-primary/20 hover:scale-[1.01]';
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pt-24 pb-32 px-6 max-w-3xl mx-auto w-full flex flex-col items-center text-center gap-8"
      >
        <div className="bg-surface-container-lowest rounded-3xl p-12 w-full shadow-sm">
          <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">Round Complete!</p>
          <BadgeCheck className="text-primary mx-auto mb-4" size={64} />
          <p className="font-headline text-5xl font-extrabold text-primary mb-2">{score}/{pairs.length}</p>
          <p className="text-on-surface-variant text-lg font-medium">All pairs matched</p>
        </div>
        <div className="flex gap-4 w-full">
          <button
            onClick={handleNewRound}
            className="flex-1 pill-gradient text-white px-8 py-5 rounded-full font-headline font-bold text-lg shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCw size={20} /> New Round
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-surface-container-high text-on-surface px-8 py-5 rounded-full font-headline font-bold text-lg"
          >
            Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="pt-24 pb-32 px-6 max-w-4xl mx-auto w-full"
    >
      <section className="mb-10">
        <div className="flex justify-between items-end">
          <div className="max-w-xl">
            <span className="text-primary font-bold tracking-wider uppercase text-xs mb-3 block">
              Brand → Generic
            </span>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
              Drug Matching <span className="text-primary">Challenge</span>
            </h2>
            <p className="mt-3 text-on-surface-variant text-base font-medium">
              Tap a brand name, then tap its matching generic.
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col items-center min-w-[120px]">
            <span className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest mb-2">Score</span>
            <span className="font-headline text-4xl font-extrabold text-primary">
              {score}/{pairs.length}
            </span>
          </div>
        </div>
      </section>

      <div className="mb-10 w-full h-3 bg-secondary-container rounded-full overflow-hidden">
        <div
          className="h-full pill-gradient rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Brand names (left) */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-xs text-on-surface-variant uppercase tracking-widest px-2">
            Brand Names
          </h3>
          <AnimatePresence>
            {leftItems.map((item) => (
              <motion.button
                key={item}
                layout
                onClick={() => !matched.has(item) && setSelectedLeft(item === selectedLeft ? null : item)}
                className={`w-full p-5 rounded-2xl flex items-center border-2 transition-all duration-200 ${getItemClass(item, 'left')}`}
              >
                <span className="font-headline font-bold text-lg text-on-surface">{item}</span>
                {matched.has(item) && <BadgeCheck className="ml-auto text-primary" size={18} />}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Generic names (right) */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-xs text-on-surface-variant uppercase tracking-widest px-2">
            Generics
          </h3>
          <AnimatePresence>
            {rightItems.map((item) => (
              <motion.button
                key={item}
                layout
                onClick={() => !matched.has(item) && setSelectedRight(item === selectedRight ? null : item)}
                className={`w-full p-5 rounded-2xl flex items-center border-2 transition-all duration-200 ${getItemClass(item, 'right')}`}
              >
                <span className="font-headline font-bold text-lg text-on-surface capitalize">{item}</span>
                {matched.has(item) && <BadgeCheck className="ml-auto text-primary" size={18} />}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={handleNewRound}
          className="text-on-surface-variant font-bold hover:text-primary transition-colors text-sm flex items-center gap-2 mx-auto"
        >
          <RotateCw size={16} /> New set of drugs
        </button>
      </div>
    </motion.div>
  );
};
