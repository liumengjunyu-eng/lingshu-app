'use client';

import { useEffect, useState } from 'react';
import { loadState, saveState, migrateOldState } from './storage';
import { DEFAULT_STATE, AppState } from './types';

export function useAppState(): {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  ready: boolean;
} {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 执行迁移（仅一次）
    migrateOldState();
    // 加载状态
    const loaded = loadState();
    setState(loaded);
    setReady(true);
  }, []);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => {
      const next = {
        ...prev,
        ...updates,
        recovery: updates.recovery ? { ...prev.recovery, ...updates.recovery } : prev.recovery,
        premium: updates.premium ? { ...prev.premium, ...updates.premium } : prev.premium,
      };
      saveState(next);
      return next;
    });
  };

  return { state, updateState, ready };
}
