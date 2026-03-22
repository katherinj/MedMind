# MedMind

A pharmacology study app built for PTCB exam prep. MedMind helps students study drug knowledge through flashcards, quizzes, and matching games.

> **Disclaimer:** MedMind is a study aid only. Content does not constitute medical or clinical advice and is not affiliated with, endorsed by, or approved by the Pharmacy Technician Certification Board (PTCB).

---

## Features

- **Flashcards** — cycle through drugs with a focus picker covering all Domain 1 fields. Marks cards known or for review.
- **Quiz** — auto-generated multiple choice questions from drug data. Rotates between brand→generic, generic→brand, generic→class, and class→generic question types.
- **Matching** — click-to-pair brand names with their generic counterparts. Randomized each round.
- **Field-level progress tracking** — mastery is tracked per drug _and_ per field (brand, class, side effects, interactions, etc.). A drug is only fully mastered when every field reaches ≥ 80%.
- **Auth** — email/password and Google sign-in via Firebase Authentication.
- **Personalized dashboard** — shows overall mastery %, weak drug count, and greets users by name.

---

## Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Frontend  | React 19 + Vite         |
| Language  | TypeScript              |
| Styling   | Tailwind CSS v4         |
| Animation | Motion (Framer Motion)  |
| Auth      | Firebase Authentication |
| Database  | Firestore               |
| Icons     | Lucide React            |

---

## Project Structure

```
src/
├── components/
│   ├── TopBar.tsx          # Fixed header with back + logout
│   └── BottomNav.tsx       # Bottom tab navigation
├── pages/
│   ├── Dashboard.tsx       # Home screen with mastery + modules
│   ├── Flashcards.tsx      # Flashcard study mode
│   ├── Quiz.tsx            # Multiple choice quiz mode
│   ├── Matching.tsx        # Brand/generic matching game
│   └── Login.tsx           # Auth screen (email + Google)
├── hooks/
│   ├── useAuth.ts          # Firebase auth state + login/signup/logout
│   └── useProgress.ts      # Read/write field-level progress to Firestore
├── data/
│   └── drugs.json          # Local drug database (Domain 1, Top 20 drugs)
├── types/
│   └── index.ts            # Shared TypeScript types
├── firebase.ts             # Firebase app init, auth + db exports
├── App.tsx                 # Root component + auth gating + routing
├── main.tsx
└── index.css               # Tailwind v4 theme + global styles
```

---

## Data Model

### Local — `src/data/drugs.json`

Drug data ships with the app and never hits Firestore. Each entry covers all Domain 1 subdomains:

```ts
{
  id: string                   // slug e.g. "lisinopril"
  generic: string              // 1.1
  brand: string[]              // 1.1
  class: string                // 1.1
  controlled: boolean
  schedule: string | null      // "CII", "CIV", null
  indication: string           // 1.6
  mechanism: string
  sideEffects: string[]        // 1.5
  interactions: {
    drugs: string[]            // 1.3 drug-drug
    food: string[]             // 1.3 drug-nutrient
    supplements: string[]      // 1.3 drug-dietary supplement
    lab: string[]              // 1.3 drug-laboratory values
    conditions: string[]       // 1.3 drug-disease contraindications
  }
  therapeuticDups: string[]    // 1.2 — IDs of drugs in the same class
  dosageForms: string[]        // 1.4 e.g. ["tablet", "oral solution"]
  routes: string[]             // 1.4 e.g. ["oral", "IV", "inhaled"]
  specialHandling?: string     // 1.4 e.g. "do not crush, protect from light"
  duration?: string            // 1.4 e.g. "complete full antibiotic course"
  stability?: string           // 1.7 e.g. "reconstituted suspension: 14 days refrigerated"
  storage?: string             // 1.8 temperature, light sensitivity, restricted access
}
```

### Firestore

```
users/{uid}
  displayName: string
  email: string
  createdAt: timestamp
  streak: number
  longestStreak: number
  lastStudied: timestamp | null
  totalSessions: number

users/{uid}/progress/{drugId}
  drugId: string
  lastSeen: timestamp
  overallMastery: number        // 0–100, average of all seen field masteries
  fields: {
    brand:           FieldStats
    class:           FieldStats
    indication:      FieldStats
    mechanism:       FieldStats
    sideEffects:     FieldStats
    interactions:    FieldStats
    therapeuticDups: FieldStats
    dosageForms:     FieldStats
    routes:          FieldStats
    specialHandling: FieldStats
    stability:       FieldStats
    storage:         FieldStats
  }

FieldStats {
  correct: number
  incorrect: number
  mastery: number               // 0–100 for this field only
  lastSeen: timestamp
}
```

**Overall mastery calculation:** average of all `fields[f].mastery` where `correct + incorrect > 0`. Fields never practiced don't count yet — they enter the average once answered at least once.

**Security rules:** each user can only read and write their own subtree (`request.auth.uid == uid`).

**Mastery thresholds:**

- `< 60%` → weak (surfaces in weak cards review)
- `≥ 80%` → mastered
- A drug is fully mastered only when **all fields** reach ≥ 80%

---

## PTCE Coverage — Version 1 Scope

MedMind v1 focuses on **Domain 1 — Medications (35% of the PTCE exam)**.

| Subdomain | Topic                                            | Field key(s)                                           | Status |
| --------- | ------------------------------------------------ | ------------------------------------------------------ | ------ |
| 1.1       | Generic names, brand names, classifications      | `brand`, `class`                                       | ✅     |
| 1.2       | Therapeutic duplications                         | `therapeuticDups`                                      | ✅     |
| 1.3       | Drug interactions + contraindications            | `interactions`                                         | ✅     |
| 1.4       | Dosage forms, routes, special handling, duration | `dosageForms`, `routes`, `specialHandling`, `duration` | ✅     |
| 1.5       | Side effects and adverse effects                 | `sideEffects`                                          | ✅     |
| 1.6       | Indications                                      | `indication`                                           | ✅     |
| 1.7       | Drug stability                                   | `stability`                                            | ✅     |
| 1.8       | Proper storage                                   | `storage`                                              | ✅     |

Domains 2 (Federal Requirements), 3 (Patient Safety), and 4 (Order Entry & Calculations) are planned for future versions and have been architected to integrate cleanly via `regulations.json` and `calculations.json` — see the roadmap below.

---

## Roadmap

### v1 — Domain 1 (current)

- [x] Flashcards with focus picker
- [x] Multiple choice quiz
- [x] Matching game
- [x] Firebase auth (email + Google)
- [x] Real-time progress saving to Firestore
- [x] Field-level mastery tracking per drug
- [x] Update drugs.json with full Domain 1 fields (all 20 drugs)
- [ ] Weak cards review mode (surfaces weak fields, not just weak drugs)
- [ ] Streak tracking
- [ ] Profile / stats page with per-field mastery breakdown
- [ ] Expand to Top 100 drugs

### v2 — Full PTCE Coverage

- [ ] `regulations.json` — Domains 2 & 3 (DEA schedules, REMS, LASA, error prevention)
- [ ] `calculations.json` — Domain 4 math practice (days supply, dilutions, sig codes)
- [ ] Dedicated calc practice mode with step-by-step worked solutions
- [ ] Domain filter on quiz and flashcards
- [ ] Session history

### v3 — Growth

- [ ] iOS app (Swift/SwiftUI)
- [ ] Leaderboards
- [ ] Spaced repetition algorithm
- [ ] User-reported content corrections

---

## Contributing

This project is currently in active development. If you find a drug data error, please open an issue — accuracy matters here.

---

## License

MIT
