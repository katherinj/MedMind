export type Screen = "dashboard" | "flashcards" | "quiz" | "matching";

export interface Drug {
  id: string;
  generic: string;
  brand: string[];
  class: string;
  controlled: boolean;
  schedule: string | null;
  indication: string;
  mechanism: string;
  sideEffects: string[];
  interactions: {
    drugs: string[];
    food: string[];
    conditions: string[];
  };
}
