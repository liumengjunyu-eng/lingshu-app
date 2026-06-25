export type AppState = {
  recovery: {
    stage: number;
    fatigueLevel: number;
    recoveryScore: number;
    streak: number;
    lastTaskId: string | null;
  };

  premium: {
    isPremium: boolean;
    purchasedAt: number | null;
  };

  meta: {
    version: number;
    updatedAt: number;
  };
};

export const DEFAULT_STATE: AppState = {
  recovery: {
    stage: 0,
    fatigueLevel: 6,
    recoveryScore: 2,
    streak: 0,
    lastTaskId: null,
  },
  premium: {
    isPremium: false,
    purchasedAt: null,
  },
  meta: {
    version: 1,
    updatedAt: Date.now(),
  },
};
